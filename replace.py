import re

content = open("docs/emails/matriz-de-emails.md").read()

def replacer(match):
    interface_block = match.group(0)
    lines = interface_block.split('\n')
    new_lines = []
    for line in lines:
        if line.strip().startswith('interface'):
            new_lines.append(line)
        elif ':' in line and not line.strip().startswith('//') and not line.strip().startswith('/*'):
            # simple comment addition
            field = line.split(':')[0].strip()
            comment = f"  /** Valor correspondente ao campo {field} */"
            new_lines.append(comment)
            new_lines.append(line)
        else:
            new_lines.append(line)
    return '\n'.join(new_lines)

# Fix comments in interfaces
content = re.sub(r'interface [A-Za-z0-9_]+Payload \{[^}]+\}', replacer, content)

with open("docs/emails/matriz-de-emails.md", "w") as f:
    f.write(content)
