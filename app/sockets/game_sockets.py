import threading

from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
from app import socketio
from app.models import User, db


# Shared matchmaking state, mutated from handlers running on many gunicorn
# threads — every read-modify sequence must hold state_lock.
open_games = []
active_invites = []
active_sockets = []
state_lock = threading.Lock()


def find_invite(lst, key1, value1, key2, value2):
    for i, dic in enumerate(lst):
        if dic[key1] == value1 and dic[key2] == value2:
            return i
    return -1


def find_open_game(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1


@socketio.on("connect")
def handle_connect():
    pass


@socketio.on("disconnect")
def handle_disconnect():
    sock = None
    with state_lock:
        index = find_open_game(active_sockets, "sid", request.sid)
        if index > -1:
            sock = active_sockets.pop(index)
    if sock:
        user = db.session.get(User, int(sock["user_id"]))
        if user is None:
            return
        user.status = "offline"
        db.session.commit()


@socketio.on("online")
def update_online(data):
    user = db.session.get(User, int(data["user_id"]))
    if user is None:
        return
    user.status = "online"
    db.session.commit()
    with state_lock:
        active_sockets.append({"sid": request.sid, "user_id": data["user_id"]})
    return user.to_dict()


@socketio.on("ingame")
def update_ingame(data):
    user = db.session.get(User, int(data["user_id"]))
    if user is None:
        return
    user.status = "in game"
    db.session.commit()
    return user.to_dict()


@socketio.on("find_game")
def host_room(data):
    # data includes - user_id(of user making action)
    leave_room(data["user_id"])
    host = None
    waiting = False
    with state_lock:
        if open_games and open_games[0]['user_id'] != data["user_id"]:
            host = open_games.pop(0)
        elif not open_games:
            open_games.append({'user_id': data["user_id"], 'username': data["username"]})
            waiting = True
    if host:
        room_id = host['user_id']
        join_room(room_id)
        data["room_id"] = room_id
        data["host_username"] = host['username']
        data["turn_order"] = [room_id, data["user_id"]]
        data['guest_username'] = data["username"]
        emit('setup_game', data, room=room_id, broadcast=True)
    elif waiting:
        data['room_id'] = data["user_id"]
        join_room(data['user_id'])
        emit('waiting_for_game', data, room=data['room_id'], broadcast=True)
    else:
        # Already first in the queue (self-match); keep waiting.
        join_room(data['user_id'])


@socketio.on("cancel_matchmaking")
def cancel_matchmaking(data):
    # data includes - user_id
    with state_lock:
        index = find_open_game(open_games, "user_id", data['user_id'])
        if index > -1:
            open_games.pop(index)


@socketio.on("ai_game")
def ai_game(data):
    user = db.session.get(User, int(data["user_id"]))
    # if user is None:
    #     return
    user.status = "in AI game"
    db.session.commit()
    join_room(f"{data['user_id']}ai")


@socketio.on("invite_to_game")
def invite_to_game(data):
    # data includes - user_id, target_id, username
    with state_lock:
        index = find_invite(active_invites, "host", data["target_id"], "invitee", data["user_id"])
        matched = index > -1
        if matched:
            active_invites.pop(index)
        else:
            active_invites.append({
                "host": data["user_id"],
                "invitee": data["target_id"],
            })
    if matched:
        join_room(data['target_id'])
        new_data = {
            "room_id": data["target_id"],
            "host_username": data["target_name"],
            "turn_order": [data['target_id'], data['user_id']],
            "guest_username": data['username']
        }
        emit('setup_game', new_data, room=data["host_id"], broadcast=True)
    else:
        join_room(data['user_id'])
        emit('waiting_for_game', data, room=data['user_id'], broadcast=True)


@socketio.on("accept_invite")
def accept_invite(data):
    # data includes - host_id, user_id, host_name, username
    with state_lock:
        invite = find_invite(active_invites, "host", data["host_id"], "invitee", data["user_id"])
        if invite > -1:
            active_invites.pop(invite)

    join_room(data['host_id'])
    new_data = {
        "room_id": data["host_id"],
        "host_username": data["host_name"],
        "turn_order": [data['host_id'], data['user_id']],
        "guest_username": data['username']
    }
    emit('setup_game', new_data, room=data["host_id"], broadcast=True)


@socketio.on("cancel_invite")
def cancel_invite(data):
    # data includes - host_id, user_id, host_name, username
    with state_lock:
        invite = find_invite(active_invites, "host", data["host_id"], "invitee", data["user_id"])
        if invite > -1:
            active_invites.pop(invite)


@socketio.on("check_for_invites")
def check_for_invites(data):
    # data includes - user_id
    with state_lock:
        invites = [inv["host"] for inv in active_invites if inv["invitee"] == data["user_id"]]
    if invites:
        emit('found_games', {"invites": invites})


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
def end_turn(data):
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