from app.models import db, CardType


def seed_card_types():
    tiger_man = CardType(
        name='Tiger Man',
        type='unit',
        attack=900,
        defense=500,
        description="After being bit by a radioactive tiger, Tony was transported to a different dimension.  Now, he battles endlessly in search of his favorite comfort food, frosted flakes.",
        rarity=0,
        picture_url='http://clipart-library.com/clipart/8TAbaX8Ac.htm'
    )
    db.session.add(tiger_man)

    gordon_ramsay = CardType(
        name='Gordon Ramsay',
        type='unit',
        attack=750,
        defense=450,
        description="IT'S BURNT!!!!",
        rarity=1,
        picture_url='https://upload.wikimedia.org/wikipedia/commons/6/6f/Gordon_Ramsay.jpg'
    )
    db.session.add(gordon_ramsay)

    guy_fieri = CardType(
        name='Guy Fieri',
        type='unit',
        attack=450,
        defense=750,
        description="The mayor of flavor town",
        rarity=1,
        picture_url='https://i.insider.com/5bf33b3148eb123c38265eb6?width=700'
    )

    db.session.add(guy_fieri)

    the_intern = CardType(
        name='an intern',
        type='unit',
        attack=200,
        defense=200,
        description="Heading out for coffee!!  Can I get you anything?",
        rarity=0,
        picture_url='https://thumbs.dreamstime.com/z/female-intern-fetching-coffee-office-portrait-114719485.jpg'
    )

    db.session.add(the_intern)

    doge = CardType(
        name='doge',
        type='unit',
        attack=500,
        defense=200,
        description="wow, such memes",
        rarity=0,
        picture_url='https://blogs.unimelb.edu.au/sciencecommunication/files/2016/10/shibe-vqscp3-300x225.png'
    )

    db.session.add(doge)

    muscle_doge = CardType(
        name='buff doge',
        type='unit',
        attack=1100,
        defense=500,
        description="Mom said it's my turn to use the xbox",
        rarity=0,
        picture_url='https://i.imgur.com/zDuMDuW.jpg',
        evolution_id=5
    )

    db.session.add(muscle_doge)

    kirby_with_human_feet = CardType(
        name='Kirby with Human Feet',
        type='unit',
        attack=700,
        defense=450,
        description="He's always had them",
        rarity=1,
        picture_url='https://i.ytimg.com/vi/VmJwIUFyPNc/maxresdefault.jpg',
    )

    db.session.add(kirby_with_human_feet)

    kirby_with_human_legs = CardType(
        name='Kirby With Human Legs',
        type='unit',
        attack=1200,
        defense=750,
        description="He's always had them",
        rarity=2,
        picture_url='https://ih1.redbubble.net/image.653773798.4533/flat,750x,075,f-pad,750x1000,f8f8f8.u18.jpg',
        evolution_id=7
    )

    db.session.add(kirby_with_human_legs)

    kirby_with_a_knife = CardType(
        name='Kirby With a Knife',
        type='unit',
        attack=1600,
        defense=1400,
        description="oh god oh no where did he get that",
        rarity=3,
        picture_url='https://i.redd.it/a14170iksok41.png',
        evolution_id=8
    )

    db.session.add(kirby_with_a_knife)

    a_cow = CardType(
        name='a cow',
        type='unit',
        attack=600,
        defense=100,
        description="moooooooooooooooooooooo",
        rarity=0,
        picture_url='https://i.imgur.com/nrPDz5l.jpg',
    )

    db.session.add(a_cow)

    a_duck = CardType(
        name='a duck',
        type='unit',
        attack=450,
        defense=700,
        description="quack quack quack",
        rarity=0,
        picture_url='https://i.imgur.com/z5yrNHw.jpg',
    )

    db.session.add(a_duck)

    a_goose = CardType(
        name='a goose',
        type='unit',
        attack=650,
        defense=1200,
        description="Watch out for that guy",
        rarity=0,
        picture_url='https://i.imgur.com/NcOMN3G.jpg'
    )

    db.session.add(a_goose)

    turtle = CardType(
        name='turtle',
        type='unit',
        attack=250,
        defense=1300,
        description="turtle",
        rarity=2,
        picture_url='https://i.imgur.com/DkX6A7O.jpg'
    )

    db.session.add(turtle)

    small_lizard = CardType(
        name='a Small Lizard',
        type='unit',
        attack=300,
        defense=200,
        description="a small little guy!",
        rarity=0,
        picture_url='https://i.imgur.com/NOJnAJs.jpg'
    )

    db.session.add(small_lizard)

    big_lizard = CardType(
        name='a Big Lizard',
        type='unit',
        attack=700,
        defense=650,
        description='A bigger lizard!!',
        rarity=0,
        picture_url='https://i.imgur.com/QfL328L.jpg?fb',
        evolution_id=14
    )

    db.session.add(big_lizard)

    massive_lizard = CardType(
        name='a Massive Lizard',
        type='unit',
        attack=1650,
        defense=900,
        description='oh dang that\'s godzilla',
        rarity=3,
        picture_url='https://i.imgur.com/tlxIpwU.jpg',
        evolution_id=15
    )

    db.session.add(massive_lizard)

    tom_betthauser = CardType(
        name='Tom Betthauser',
        type='unit',
        attack=400,
        defense=1200,
        description='Instructional Assisstant for AA and all around good guy',
        rarity=4,
        picture_url='https://ca.slack-edge.com/T03GU501J-ULWR1NB0B-9fe136407b1a-512'
    )

    db.session.add(tom_betthauser)

    eggdog = CardType(
        name="Egg Dog",
        type='unit',
        attack=1000,
        defense=1450,
        rarity=4,
        description='Half egg, half dog',
        picture_url='https://i.imgur.com/CLlulF3.jpg?fb'
    )

    db.session.add(eggdog)

    eat_a_sandwich = CardType(
        name='Eat A Sandwich',
        type='spell',
        description='A small but relatively healthy meal.',
        effect='heal:200',
        rarity=0,
        picture_url='https://i.imgur.com/G3axAyg.jpg'
    )

    db.session.add(eat_a_sandwich)

    monster_energy = CardType(
        name='Monster Energy Drink',
        type='spell',
        description='Monster Energy does not sponsor this post',
        effect='heal:400',
        rarity=1,
        picture_url='https://i.imgur.com/8ycOsaN.jpg',
    )

    db.session.add(monster_energy)

    liquid_courage = CardType(
        name='Liquid Courage',
        type='spell',
        description="Ask them out -- they'll definitely say yes",
        effect='heal:600',
        rarity=2,
        picture_url='https://i.pinimg.com/736x/13/75/19/13751947a266a2f4d7e19093e2ca0d8e.jpg'
    )

    db.session.add(liquid_courage)

    throw_rocks = CardType(
        name='Throw Rocks',
        type='spell',
        description='Throw some rocks at \'em!!',
        effect='damage:200',
        rarity=0,
        picture_url='https://i.imgur.com/poBikWY.jpg'
    )

    db.session.add(throw_rocks)

    fire = CardType(
        name='Fire',
        type='spell',
        description='Light them on fire!',
        effect='damage:400',
        rarity=1,
        picture_url='https://i.imgur.com/2DQdxoE.jpg'
    )

    db.session.add(fire)

    meteor = CardType(
        name='Meteor',
        type='spell',
        description='Yeah pretty much gonna destroy everything man',
        effect='damage:600',
        rarity=2,
        picture_url='https://i.imgur.com/0SmIl8Q.jpg'
    )

    db.session.add(meteor)

    db.session.commit()

def undo_card_types():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()