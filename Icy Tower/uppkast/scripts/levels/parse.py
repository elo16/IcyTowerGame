################################################
# Parse level text files into javascript files #
################################################

lines = []

with open('level1.txt', 'rU') as f:
    i = 0;
    for line in f:
        if i > 3:
            lines.append('[' + line.strip('\n').replace(' ', '0,').replace('-', '1,') + ']')
        else:
            i += 1;

with open('levels.js', 'w+') as o:
    o.write('var g_levels = [];\n\n')
    o.write('g_levels.push([\n')
    for line in lines[::-1][:len(lines)-1]:
        o.write(line.replace(',]', ']') + ',\n')
    o.write(lines[::-1][len(lines)-1].replace(',]', ']') + '\n')
    o.write(']);')
