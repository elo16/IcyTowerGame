#################################################
#                Generate levels                #
#################################################

import random

levels = []


Biggertypes = [
    '-----',
    ' -----',
    '  -----',
    '   -----',
    '    -----',
    '     -----',
    '      -----',
    '       -----',
    '        -----',
    '         -----',
    '          -----',
    '           -----',
]


types = [
    '----',
    ' ----',
    '  ----',
    '   ----',
    '    ----',
    '     ----',
    '      ----',
    '       ----',
    '        ----',
    '         ----',
    '          ----',
    '           ----',
    '            ----',
]

rare_types = [
    '--',
    ' --',
    '  --',
    '   --',
    '    --',
    '     --',
    '      --',
    '       --',
    '        --',
    '         --',
    '          --',
    '           --',
    '            --',
    '             --',
    '              --',
    '---',
    ' ---',
    '  ---',
    '   ---',
    '    ---',
    '     ---',
    '      ---',
    '       ---',
    '        ---',
    '         ---',
    '          ---',
    '           ---',
    '            ---',
    '             ---'
]

rarest_types = [
    ' --  ----',
    '  --     --',
    '    --   ---',
    ' --      ----',
    '    --     ----',
    '   --       ----',
]

NUM_LEVELS = 5
NUM_ROWS = 100

with open('levels2.js', 'w+') as o:
    o.write('var g_levels = [];\n\n')

    for i in range(1, NUM_LEVELS + 1):
        o.write('g_levels.push([\n')
        for j in range(1, NUM_ROWS + 1):
            r = random.random()
            whatType = (random.random()*4)+1
            whatType = round(whatType)
            if r < 0:
                o.write(('[' + random.choice(rarest_types).replace(' ', '0,').replace('-', str(whatType) + ',') + ']').replace(',]',']'))
            elif r < 0.05:
                o.write(('[' + random.choice(rare_types).replace(' ', '0,').replace('-', str(whatType) + ',') + ']').replace(',]',']'))
            elif r >= 0.05 and r < 0.85:
                o.write(('[' + random.choice(types).replace(' ', '0,').replace('-', str(whatType) + ',') + ']').replace(',]',']'))
            else:
                o.write(('[' + random.choice(Biggertypes).replace(' ', '0,').replace('-', str(whatType) + ',') + ']').replace(',]',']'))
            if j < NUM_ROWS:
                o.write(',\n')
            else:
                o.write('\n')
        o.write(']);\n\n')


'''
import random

levels = []


Biggertypes = [
    '-----',
    ' -----',
    '  -----',
    '   -----',
    '    -----',
    '     -----',
    '      -----',
    '       -----',
    '        -----',
    '         -----',
    '          -----',
    '           -----',
]


types = [
    '----',
    ' ----',
    '  ----',
    '   ----',
    '    ----',
    '     ----',
    '      ----',
    '       ----',
    '        ----',
    '         ----',
    '          ----',
    '           ----',
    '            ----',
]
'''
rare_types = [
    '--',
    ' --',
    '  --',
    '   --',
    '    --',
    '     --',
    '      --',
    '       --',
    '        --',
    '         --',
    '          --',
    '           --',
    '            --',
    '             --',
    '              --',
    '--------------',
    ' ---',
    '  ---',
    '   ---',
    '    ---',
    '     --------',
    '      ---',
    '       ---',
    '        ---',
    '         ---',
    '          ---',
    '           ---',
    '            ---',
    '             ---'
]
'''

rare_types = [
    '--   --  --   --'

]

rarest_types = [
    ' --      --',
    '  --  --',
    '    --   ---',
    ' --      --',
    '    --     ',
    '   --       ----',
    '--           ---',
    ' -      -',
    '  --  -',
    '    -   ---',
    ' -      --',
    '    --     - -',

]


NUM_LEVELS = 5
NUM_ROWS = 100

with open('levels2.js', 'w+') as o:
    o.write('var g_levels = [];\n\n')

    for i in range(1, NUM_LEVELS + 1):
        o.write('g_levels.push([\n')
        for j in range(1, NUM_ROWS + 1):
            r = random.random()

            if r < 0.40:
                o.write(('[' + random.choice(rarest_types).replace(' ', '0,').replace('-', str(i) + ',') + ']').replace(',]',']'))
            elif r >= 0.40 and r < 0.50:
                o.write(('[' + random.choice(rare_types).replace(' ', '0,').replace('-', str(i) + ',') + ']').replace(',]',']'))
            elif r >= 0.5:
                o.write(('[' + random.choice(types).replace(' ', '0,').replace('-', str(i) + ',') + ']').replace(',]',']'))
            else:
                o.write(('[' + random.choice(Biggertypes).replace(' ', '0,').replace('-', str(i) + ',') + ']').replace(',]',']'))
            if j < NUM_ROWS:
                o.write(',\n')
            else:
                o.write('\n')
        o.write(']);\n\n')

'''