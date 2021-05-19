from app.models import db, CardType


def seed_card_types():
    tiger_man = CardType(
        name='Tiger Man',
        type='unit',
        attack=400,
        defense=200,
        description="After being bit by a radioactive tiger, Tony was transported to a different dimension.  Now, he battles endlessly in search of his favorite comfort food, frosted flakes.",
        rarity=0,
        picture_url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2GKjvCuMeGNRTkm_GmThmck38dLnUGAS77A&usqp=CAU'
    )
    db.session.add(tiger_man)

    line_cook = CardType(
        name='Line Cook',
        type='unit',
        attack=350,
        defense=300,
        description='Not good at his job, but not great either.',
        rarity=0,
        picture_url='https://media.gettyimages.com/photos/line-cook-preparing-cilantro-in-restaurant-kitchen-picture-id546304027'
    )

    db.session.add(line_cook)

    gordon_ramsay = CardType(
        name='Gordon Ramsay',
        type='unit',
        attack=950,
        defense=650,
        description="IT'S BURNT!!!!",
        rarity=1,
        picture_url='https://upload.wikimedia.org/wikipedia/commons/6/6f/Gordon_Ramsay.jpg',
        evolution_name='Line Cook'
    )
    db.session.add(gordon_ramsay)

    guy_fieri = CardType(
        name='Guy Fieri',
        type='unit',
        attack=650,
        defense=950,
        description="The mayor of flavor town",
        rarity=1,
        picture_url='https://i.insider.com/5bf33b3148eb123c38265eb6?width=700',
        evolution_name='Line Cook'
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

    an_employee = CardType(
        name='median salary employee',
        type='unit',
        attack=800,
        defense=700,
        description="'Workin hard, or hardly workin?' - Laura from accounting",
        rarity=0,
        picture_url='https://i.imgur.com/mkaZLqq.jpg',
        evolution_name='an intern'
    )

    db.session.add(an_employee)

    regional_manager = CardType(
        name='regional manager',
        type='unit',
        attack=1300,
        defense=1200,
        description="Soulless cog in the machine",
        rarity=1,
        picture_url='https://i.imgur.com/SXNGBBg.jpg',
        evolution_name='median salary employee'
    )

    db.session.add(regional_manager)

    doge = CardType(
        name='doge',
        type='unit',
        attack=200,
        defense=300,
        description="wow, such memes",
        rarity=0,
        picture_url='https://blogs.unimelb.edu.au/sciencecommunication/files/2016/10/shibe-vqscp3-300x225.png'
    )

    db.session.add(doge)

    muscle_doge = CardType(
        name='buff doge',
        type='unit',
        attack=1000,
        defense=500,
        description="Mom said it's my turn to use the xbox",
        rarity=0,
        picture_url='https://i.imgur.com/zDuMDuW.jpg',
        evolution_name='doge'
    )

    db.session.add(muscle_doge)

    kirby_with_human_feet = CardType(
        name='Kirby with Human Feet',
        type='unit',
        attack=300,
        defense=450,
        description="He's always had them",
        rarity=3,
        picture_url='https://i.ytimg.com/vi/VmJwIUFyPNc/maxresdefault.jpg',
    )

    db.session.add(kirby_with_human_feet)

    kirby_with_human_legs = CardType(
        name='Kirby With Human Legs',
        type='unit',
        attack=1200,
        defense=750,
        description="He's always had them",
        rarity=3,
        picture_url='https://ih1.redbubble.net/image.653773798.4533/flat,750x,075,f-pad,750x1000,f8f8f8.u18.jpg',
        evolution_name='Kirby with Human Feet'
    )

    db.session.add(kirby_with_human_legs)

    kirby_with_a_knife = CardType(
        name='Kirby With a Knife',
        type='unit',
        attack=1600,
        defense=1400,
        description="oh god oh no where did he get that",
        rarity=4,
        picture_url='https://i.redd.it/a14170iksok41.png',
        evolution_name='Kirby With Human Legs'
    )

    db.session.add(kirby_with_a_knife)

    a_cow = CardType(
        name='a cow',
        type='unit',
        attack=600,
        defense=100,
        description="moooooooooooooooo",
        rarity=2,
        picture_url='https://i.imgur.com/nrPDz5l.jpg',
    )

    db.session.add(a_cow)

    a_duck = CardType(
        name='A Duck',
        type='unit',
        attack=200,
        defense=550,
        description="quack quack quack",
        rarity=0,
        picture_url='https://i.imgur.com/z5yrNHw.jpg',
    )

    db.session.add(a_duck)

    a_goose = CardType(
        name='A Goose',
        type='unit',
        attack=650,
        defense=1000,
        description="Watch out for that guy",
        rarity=0,
        picture_url='https://i.imgur.com/NcOMN3G.jpg',
        evolution_name="A Duck"
    )

    db.session.add(a_goose)

    turtle = CardType(
        name='turtle',
        type='unit',
        attack=250,
        defense=800,
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
        attack=900,
        defense=750,
        description='A bigger lizard!!',
        rarity=1,
        picture_url='https://i.imgur.com/QfL328L.jpg?fb',
        evolution_name='a Small Lizard'
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
        evolution_name='a Big Lizard'
    )

    db.session.add(massive_lizard)

    tom_betthauser = CardType(
        name='Tom Betthauser',
        type='unit',
        attack=400,
        defense=800,
        description='Instructional Assisstant for AA and all around good guy',
        rarity=4,
        picture_url='https://ca.slack-edge.com/T03GU501J-ULWR1NB0B-9fe136407b1a-512'
    )

    db.session.add(tom_betthauser)

    eggdog = CardType(
        name="Egg Dog",
        type='unit',
        attack=800,
        defense=850,
        rarity=3,
        description='Half egg, half dog',
        picture_url='https://i.imgur.com/CLlulF3.jpg?fb'
    )

    db.session.add(eggdog)

    anakin_swordwalker = CardType(
        name="Anakin Swordwalker",
        type='unit',
        attack=1300,
        defense=900,
        rarity=4,
        description='A long time ago in a galaxy far far away',
        picture_url='https://i.imgur.com/w5xOV55.jpg',
        evolution_name='Generic Sword Guy'
    )

    db.session.add(anakin_swordwalker)

    generic_sword_guy = CardType(
        name='Generic Sword Guy',
        type='unit',
        attack=550,
        defense=750,
        rarity=1,
        description='A guy with a sword',
        picture_url='https://i.imgur.com/JG9ihvA.jpg'
    )

    db.session.add(generic_sword_guy)

    obi_wan = CardType(
        name="Obi Wan Shinobi",
        type='unit',
        attack=1550,
        defense=750,
        rarity=3,
        description="He's got a bad feeling about this",
        picture_url="https://i.imgur.com/hYLdtNl.jpg",
        evolution_name='Generic Sword Guy'
    )

    db.session.add(obi_wan)

    normal_bird = CardType(
        name="Normal Bird",
        type='unit',
        attack=350,
        defense=300,
        rarity=0,
        description='chirp!  chirp chirp!',
        picture_url='https://i.imgur.com/lhkeiX9.jpg'
    )

    db.session.add(normal_bird)

    bird_shark = CardType(
        name="Bird Shark",
        type='unit',
        attack=850,
        defense=400,
        rarity=2,
        description='flying shark do do do-do do-do',
        picture_url='https://i.imgur.com/OYtMqL1.jpg',
        evolution_name='Normal Bird'
    )

    db.session.add(bird_shark)

    big_bird = CardType(
        name='Big Bird',
        type='unit',
        attack=1450,
        defense=1100,
        rarity=3,
        description='Brought to you by the letter pain',
        picture_url='https://i.imgur.com/KM1rXuw.jpg',
        evolution_name='Bird Shark'
    )

    db.session.add(big_bird)

    generic_archer = CardType(
        name='Dude with a Bow',
        type='unit',
        attack=650,
        defense=650,
        rarity=1,
        description="He's got a hood on too, looks like",
        picture_url='https://wallpaper.dog/large/10829005.jpg',
    )

    db.session.add(generic_archer)

    a_tree = CardType(
        name='A Tree',
        type='unit',
        attack=0,
        defense=400,
        rarity=0,
        picture_url='http://i.imgur.com/EZkuP8p.jpg',
        description="Just a normal tree"
    )

    db.session.add(a_tree)

    treebeard = CardType(
        name='Treebeard',
        type='unit',
        attack=600,
        defense=900,
        rarity=2,
        description="That tree is Moving???",
        picture_url='https://i.imgur.com/CVy07wV.png',
        evolution_name='A Tree'
    )

    db.session.add(treebeard)

    young_link = CardType(
        name='Young Link',
        type='unit',
        attack=600,
        defense=400,
        rarity=2,
        description='HIYAH!  HAAAAAA',
        picture_url='https://i.imgur.com/7eVvA8Q.jpg'
    )

    db.session.add(young_link)

    link = CardType(
        name='Link',
        type='unit',
        picture_url='https://i.imgur.com/9OvEmtl.png',
        attack=1550,
        defense=750,
        rarity=3,
        description='The Hero Of Time',
        evolution_name='Young Link'
    )

    db.session.add(link)

    invader_zim = CardType(
        name='Invader Zim',
        type='unit',
        picture_url='https://i.imgur.com/xSZIuvT.jpg?fb',
        attack=500,
        defense=400,
        rarity=2,
        description='Copyright Infringement',
    )

    db.session.add(invader_zim)

    toyota_corolla = CardType(
        name='A 1996 Toyota Corolla',
        type='unit',
        picture_url='https://media.ed.edmunds-media.com/for-sale/4e-1nxba02e6vz571793/img-1-600x400.jpg',
        attack=300,
        defense=300,
        rarity=0,
        description='CLEAN TITLE/NEW TIMING BELT/CALL NOW'
    )

    db.session.add(toyota_corolla)

    barack_obama_tan_suit = CardType(
        name='Tan Suit Barack Obama',
        type='unit',
        picture_url='https://i.imgur.com/rb6eYte.jpg',
        attack=400,
        defense=500,
        rarity=1,
        description='While President Barack Obama was busy addressing the nation during yesterday’s press conference, social media only noticed one thing-his tan suit.'
    )

    db.session.add(barack_obama_tan_suit)

    barack_obama_jedi = CardType(
        name='Jedi Barack Obama',
        type='unit',
        picture_url='https://thefederalist.com/wp-content/uploads/2014/11/white-house.jpg',
        attack=1200,
        defense=600,
        rarity=3,
        evolution_name='Tan Suit Barack Obama',
        description="uhhhhhh these are not the droids... that you're looking for!"
    )

    db.session.add(barack_obama_jedi)

    party_barack = CardType(
        name='Party Barack',
        type='unit',
        picture_url='https://i.imgur.com/MbaQr.png',
        attack=600,
        defense=1200,
        rarity=2,
        evolution_name='Tan Suit Barack Obama',
        description='Just hangin'
    )

    db.session.add(party_barack)

    a_rock = CardType(
        name="90's The Rock",
        type='unit',
        attack=400,
        defense=200,
        picture_url='https://i.imgur.com/TrwuNH2.jpg',
        rarity=1,
        description='Phanny Pack'
    )

    db.session.add(a_rock)

    aaron_jones = CardType(
        name="Aaron Jones",
        type='unit',
        attack=500,
        defense=450,
        picture_url='https://i.imgur.com/MOl9t2K.jpg',
        rarity=4,
        description='go pack go'
    )

    db.session.add(aaron_jones)

    leroy_jenkins = CardType(
        name='LEEROYYYYYYY JENKINNSSSSS',
        type='unit',
        picture_url='https://i.imgur.com/4MqSjFr.jpg',
        attack=600,
        defense=100,
        rarity=1,
        description='Always confident'
    )

    db.session.add(leroy_jenkins)

    cthulhu = CardType(
        name='Cthulhu',
        type='unit',
        picture_url='https://i.imgur.com/mjPY2yr.jpg',
        attack=400,
        defense=400,
        rarity=3,
        description='Probably should be stronger'
    )

    db.session.add(cthulhu)

    king_arthur = CardType(
        name='King Arthur of Camelot',
        type='unit',
        picture_url='https://i.imgur.com/oHTG3kv.jpg',
        attack=650,
        defense=500,
        rarity=3,
        description='KING OF THE BRITTONS'
    )

    db.session.add(king_arthur)

    knight_who_says_ni = CardType(
        name='Knight Who Says "Ni!"',
        type='unit',
        picture_url='https://i.imgur.com/Odyx5ayh.jpg',
        attack=500,
        defense=650,
        rarity=3,
        description='Ni!  Ni!  Ni!'
    )

    db.session.add(knight_who_says_ni)

    legendary_mirelurk = CardType(
        name='Legendary Mirelurk',
        type='unit',
        picture_url='https://i.imgur.com/tAI7kLo.jpg',
        attack=600,
        defense=100,
        rarity=2,
        description="HE'S RIPPED!"
    )

    db.session.add(legendary_mirelurk)

    legendary_mirelurk_killclaw = CardType(
        name='Legendary Mirelurk Killclaw',
        type='unit',
        picture_url='https://64.media.tumblr.com/1b2ab53ff0438091dd84ff9c5898258e/tumblr_p727z6PwZQ1x5ccm3o1_500.jpg',
        attack=1200,
        defense=500,
        rarity=2,
        description="WATCH OUT HE'S A BIGGUN"
    )

    whiterun_guard = CardType(
        name='Whiterun Guard',
        type='unit',
        picture_url='https://i.imgur.com/dXyipwS.jpg',
        attack=200,
        defense=200,
        rarity=0,
        description='I used to be an adventure like you...'
    )

    db.session.add(whiterun_guard)

    burma_guard = CardType(
        name='Burma Guard',
        type='unit',
        picture_url='https://i.imgur.com/FhTexKsh.jpg',
        attack=200,
        defense=200,
        rarity=0,
        description="I don't think we're going to make it out of here alive!"
    )

    db.session.add(burma_guard)

    generic_bald_guy = CardType(
        name='Generic Bald Guy',
        type='unit',
        picture_url='https://st.depositphotos.com/1000350/1663/i/950/depositphotos_16632665-stock-photo-shocked-bald-man-holding-comb.jpg',
        attack=200,
        defense=200,
        rarity=0,
        description='Just a bald guy'
    )

    db.session.add(generic_bald_guy)

    mr_clean = CardType(
        name='Mr Clean',
        type='unit',
        picture_url='https://i.imgur.com/xtdagQH.png',
        attack=800,
        defense=800,
        rarity=1,
        description="Keep it clean or I'll get mean!",
        evolution_name='Generic Bald Guy'
    )

    db.session.add(mr_clean)

    avatar_aang = CardType(
        name='Avatar Aang',
        type='unit',
        picture_url='http://images5.fanpop.com/image/photos/31100000/Aang-avatar-aang-31177440-495-495.jpg',
        attack=1250,
        defense=700,
        rarity=2,
        description='The last airbender',
        evolution_name='Generic Bald Guy'
    )

    db.session.add(avatar_aang)

    one_punch_man = CardType(
        name='One Punch Man',
        type='unit',
        picture_url='https://i.pinimg.com/originals/15/c5/58/15c558a7dada7d816e577f7114aee158.jpg',
        attack=1500,
        defense=1000,
        rarity=4,
        description='100 pushups, 100 situps, 100km run each day!',
        evolution_name='Generic Bald Guy'
    )

    db.session.add(one_punch_man)

    thanos = CardType(
        name='Thanos',
        type='unit',
        picture_url='https://i.imgur.com/8CCsEEP.jpg',
        attack=1200,
        defense=800,
        rarity=4,
        description='*snaps finger*',
        evolution_name='Generic Bald Guy'
    )

    db.session.add(thanos)

    ###### SPELLS ######

    eat_a_sandwich = CardType(
        name='Eat A Sandwich',
        type='spell',
        description='Restores 200 points of health',
        effect='heal:200',
        rarity=0,
        picture_url='https://i.imgur.com/G3axAyg.jpg'
    )

    db.session.add(eat_a_sandwich)

    monster_energy = CardType(
        name='Monster Energy Drink',
        type='spell',
        description='Restores 400 points of health',
        effect='heal:400',
        rarity=1,
        picture_url='https://i.imgur.com/8ycOsaN.jpg',
    )

    db.session.add(monster_energy)

    liquid_courage = CardType(
        name='Liquid Courage',
        type='spell',
        description="Restores 600 points of health",
        effect='heal:600',
        rarity=2,
        picture_url='https://i.pinimg.com/736x/13/75/19/13751947a266a2f4d7e19093e2ca0d8e.jpg'
    )

    db.session.add(liquid_courage)

    throw_rocks = CardType(
        name='Throw Rocks',
        type='spell',
        description='Deals 200 damage to your opponent',
        effect='damage:200',
        rarity=0,
        picture_url='https://i.imgur.com/poBikWY.jpg'
    )

    db.session.add(throw_rocks)

    fire = CardType(
        name='Fire',
        type='spell',
        description='Deals 400 points of damage to your opponent',
        effect='damage:400',
        rarity=1,
        picture_url='https://i.imgur.com/2DQdxoE.jpg'
    )

    db.session.add(fire)

    meteor = CardType(
        name='Meteor',
        type='spell',
        description='Deals 600 points of damage to your opponent',
        effect='damage:600',
        rarity=2,
        picture_url='https://i.imgur.com/0SmIl8Q.jpg'
    )

    db.session.add(meteor)

    helping_hand = CardType(
        name='Helping Hand',
        type='spell',
        description='Draw one card from your deck',
        effect='draw:1',
        rarity=2,
        picture_url='https://d36m266ykvepgv.cloudfront.net/uploads/media/0TBjuAAFTv/s-775-515/high-five.jpg'
    )

    db.session.add(helping_hand)

    pot_of_greed = CardType(
        name='Pot of Greed',
        type='spell',
        description='Draw two cards from your deck',
        effect='draw:2',
        rarity=4,
        picture_url='https://i.imgur.com/RhhWbmo.png'
    )

    db.session.add(pot_of_greed)

    power_up_s = CardType(
        name='Small Power Up',
        type='spell',
        description="Increase all your units' attack by 300",
        effect='increaseAllAttack:300',
        rarity=2,
        picture_url='https://i.imgur.com/xMfSsPD.jpg'
    )

    db.session.add(power_up_s)

    power_up_m = CardType(
        name='Medium Power Up',
        type='spell',
        description="Increase all your units' attack by 600",
        effect='increaseAllAttack:600',
        rarity=3,
        picture_url='https://i.imgur.com/mmCgliy_d.webp?maxwidth=520&shape=thumb&fidelity=high'
    )

    db.session.add(power_up_m)

    power_up_l = CardType(
        name='Large Power Up',
        type='spell',
        description="Increase all your units' attack by 900",
        effect='increaseAllAttack:900',
        rarity=4,
        picture_url='https://static.wikia.nocookie.net/mario/images/e/eb/Super_Bell.png/revision/latest?cb=20140204161543'
    )

    db.session.add(power_up_l)

    straw_house = CardType(
        name='Straw House',
        type='spell',
        description="Increases all your units' defense by 300",
        effect='increaseAllDefense:300',
        rarity=2,
        picture_url='http://1.bp.blogspot.com/-JsKfLj9Umyg/TfVWDz1hxnI/AAAAAAAAAkg/YEtsEUkZe6Y/s1600/meysen_3LittlePigs_straw.jpg'
    )

    db.session.add(straw_house)

    wood_house = CardType(
        name='Wood House',
        type='spell',
        description="Increases all your units' defense by 600",
        effect='increaseAllDefense:600',
        rarity=3,
        picture_url='https://i.imgur.com/S8U7PqG.jpg'
    )

    db.session.add(wood_house)

    brick_house = CardType(
        name='Brick House',
        type='spell',
        description="SHE'S A BRIICK.  HAUUUUUSE.  Increase defense by 900",
        effect='increaseAllDefense:900',
        rarity=4,
        picture_url='https://i.imgur.com/TB5SzE4.jpg'
    )

    db.session.add(brick_house)

    light_insult = CardType(
        name="A Light Insult",
        type="spell",
        description="A harmless insult.  Decreases opponents' units attack by 300.",
        effect='decreaseAllAttack:300',
        rarity=2,
        picture_url='https://i.imgur.com/k7u9i2f.jpg'
    )

    db.session.add(light_insult)

    mean_insult = CardType(
        name='A Mean Insult',
        type="spell",
        description="You're being somewhat rude.  Decreases opponent's units attack by 600",
        effect='decreaseAllAttack:600',
        rarity=3,
        picture_url='https://c8.alamy.com/comp/XAF0T4/portrait-sad-person-put-sitting-sit-depressed-man-humans-human-beings-XAF0T4.jpg'
    )

    db.session.add(mean_insult)

    offensive_insult = CardType(
        name='An Offensive Insult',
        type='spell',
        description="Wow, you may have taken it too far.  Decreases opponent's units attack by 900",
        effect='decreaseAllAttack:900',
        rarity=4,
        picture_url='https://thumbs.dreamstime.com/z/crying-sad-man-21603917.jpg'
    )

    db.session.add(offensive_insult)

    a_light_compliment = CardType(
        name='A Light Compliment',
        type='spell',
        description="You say something nice.  Decreases opponent's units' defense by 300",
        effect='decreaseAllDefense:300',
        rarity=2,
        picture_url='https://c8.alamy.com/comp/MTAG1N/office-worker-congratulating-her-colleague-for-a-good-job-MTAG1N.jpg'
    )

    db.session.add(a_light_compliment)

    a_heartfelt_compliment = CardType(
        name='A Heartfelt Compliment',
        type='spell',
        description="You say something really nice about your opponent.  Decreases opponent's units' defense by 600",
        effect='decreaseAllDefense:600',
        rarity=3,
        picture_url='https://media3.s-nbcnews.com/i/newscms/2016_49/1180741/women-talking-friends-compliment-stock-today-161209-tease_dc7e58c67f90cc229a6b5631b0895b0b.jpg'
    )

    db.session.add(a_heartfelt_compliment)

    a_flirtatious_compliment = CardType(
        name='A Flirtatious Compliment',
        type='spell',
        description="wow, you're really going all out with this.  Decreases opponent's units' defense by 900",
        effect='decreaseAllDefense:900',
        rarity=4,
        picture_url='https://c8.alamy.com/comp/W3PP60/woman-wearing-red-shirt-laughing-broadly-glad-to-receive-compliments-W3PP60.jpg'
    )

    db.session.add(a_flirtatious_compliment)

    mega_laser = CardType(
        name='A Mega Laser',
        type='spell',
        description='A Massive laser from space.  Destroys all opponents units with less than 1000 defense.',
        effect='destroyOpponentUnitsBelowDef:1000',
        rarity=4,
        picture_url='https://i.pinimg.com/originals/b3/86/31/b386311148e474d6e6c2e225b29da243.jpg'
    )

    db.session.add(mega_laser)

    grenade = CardType(
        name='Grenade',
        type='spell',
        description='Get Down!!!!.  Destroys all opponents units with less than 350 defense.',
        effect='destroyOpponentUnitsBelowDef:350',
        rarity=1,
        picture_url='https://i.imgur.com/xfd38yq.jpg'
    )

    db.session.add(grenade)

    intimidate = CardType(
        name='Intimidation Tactics',
        type='spell',
        description='You act real mean.  Destroys all opponents units with less than 350 attack.',
        effect='destroyOpponentUnitsBelowAtt:350',
        rarity=1,
        picture_url='https://i.imgur.com/JI3OWbQ.jpg'
    )

    db.session.add(intimidate)

    drone_strike = CardType(
        name='Drone Strike',
        type='spell',
        description='Here comes Biden.  Destroys all opponents units with less than 1000 attack.',
        effect='destroyOpponentUnitsBelowAtt:1000',
        rarity=4,
        picture_url='https://i.imgur.com/Ru9V9jq.jpg'
    )

    db.session.add(drone_strike)

    call_their_mom = CardType(
        name='Call Their Mom',
        type='spell',
        description="She's going to be furious.  Destroys all opponents units with more than 1000 attack.",
        effect='destroyOpponentUnitsAboveAtt:1000',
        rarity=4,
        picture_url='https://i.imgur.com/w3fpBcF.jpg'
    )

    db.session.add(call_their_mom)

    call_their_grandma = CardType(
        name='Call Their Grandma',
        type='spell',
        description="They can't help but be nicer with her around.  Destroys all opponents units with more than 1000 defense.",
        effect='destroyOpponentUnitsAboveDef:1000',
        rarity=4,
        picture_url='https://i.imgur.com/PMgGWdI.jpg'
    )

    db.session.add(call_their_grandma)

    db.session.commit()

def undo_card_types():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()