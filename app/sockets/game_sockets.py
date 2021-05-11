from flask_socketio import SocketIO, emit, join_room, leave_room
from app import socketio


open_games = []


@socketio.on("connect")
def handle_connect():
    print("Client Connected")


@socketio.on("find_game")
def host_room(data):
    # data includes - user_id(of user making action)
    leave_room(data["user_id"])
    if len(open_games) > 0:
        host = open_games.pop(0)
        if host['user_id'] is not data["user_id"]:
            room_id = host['user_id']
            join_room(room_id)
            data["room_id"] = room_id
            data["host_username"] = host['username']
            data["turn_order"] = [room_id, data["user_id"]]
            data['guest_username'] = data["username"]
            emit('setup_game', data, room=room_id, broadcast=True)
        else:
            join_room(data['user_id'])
    else:
        open_games.append({'user_id': data["user_id"], 'username': data["username"] })
        data['room_id'] = data["user_id"]
        join_room(data['user_id'])
        emit('waiting_for_game', data, room=data['room_id'], broadcast=True)


@socketio.on("ai_game")
def ai_game(data):
    join_room(data['user_id'])

@socketio.on("start_draw_phase")
def start_draw_phase(data):
    # data includes - user_id, room_id, turn_number
    emit("draw_phase_start", data, room=data['room_id'], broadcast=True)



@socketio.on("draw_card")
def draw_card(data):
    # data includes - user_id(of user making action), hand_size, deck_size, room_id
    emit('card_drawn', data, room=data['room_id'], broadcast=True)


@socketio.on("start_placement_phase")
def start_placement_phase(data):
    # data includes - user_id, room_id
    emit('placement_phase_start', data, room=data['room_id'], broadcast=True)


@socketio.on("place_unit")
def place_card(data):
    # data includes - 
    # hand_size
    # user_id(of user making action), 
    # card_type(obj, will have all relevant info on card),  
    # unit_slot(int, where to render card)
    # room_id
    emit('unit_placed', data, room=data['room_id'], broadcast=True)


@socketio.on("place_trap")
def place_trap(data):
    # data includes - 
    # user_id(of user making action), 
    # card_type(obj, will have all relevant info on card),  
    # trap_slot(int, where to render card)
    # room_id
    emit('trap_placed', data, room=data['room_id'], broadcast=True)


@socketio.on("use_spell")
def use_spell(data):
    # data includes - 
    # user_id(of user making action), 
    # card_type(obj, will have all relevant info on card)
    # room_id
    emit("spell_used", data, room=data['room_id'], broadcast=True)


@socketio.on("start_combat_phase")
def start_combat(data):
    #data includes- user_id, room_id
    emit("combat_phase_start", data, room=data['room_id'], broadcast=True)


@socketio.on("attack")
def attack(data):
    # data includes- user_id (attacker), room_id
    # attacker_slot
    # defender_slot
    # results
    emit("unit_attack", data, room=data['room_id'], broadcast=True)


@socketio.on("activate_trap")
def activate_trap(data):
    # data includes- user_id, room_id
    # card_type(obj, will have all relevant info on card)
    # trap_slot
    emit("trap_used", data, room=data['room_id'], broadcast=True)


@socketio.on("end_turn")
def activate_trap(data):
    # data includes- user_id, room_id
    # turn number
    emit("turn_ended", data, room=data['room_id'], broadcast=True)


@socketio.on("end_game")
def end_game(data):
    # data includes- loser_id, room_id
    emit('game_ended', data, room=data['room_id'], broadcast=True)


@socketio.on("message_chat")
def message_chat(data):
    emit("chat_message", data, room=data['room_id'], broadcast=True)


@socketio.on("room_leave")
def room_leave(data):
    leave_room(data['room_id'])