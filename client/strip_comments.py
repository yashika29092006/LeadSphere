import os
import glob

def strip_comments(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    in_multiline = False

    for line in lines:
        stripped = line.strip()
        
        # Handle /** ... */
        if in_multiline:
            if '*/' in stripped:
                in_multiline = False
            continue
            
        if stripped.startswith('/**') or stripped.startswith('/*'):
            if '*/' not in stripped:
                in_multiline = True
            continue
            
        # Handle // ...
        if stripped.startswith('//'):
            continue
            
        # Handle {/* ... */}
        if stripped.startswith('{/*') and stripped.endswith('*/}'):
            continue
            
        new_lines.append(line)

    # ensure we don't leave multiple consecutive blank lines
    final_lines = []
    for line in new_lines:
        if line.strip() == '' and (not final_lines or final_lines[-1].strip() == ''):
            continue
        final_lines.append(line)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)

all_files = glob.glob(r"c:\Projects\Frontend\Frontend\client\src\**\*.jsx", recursive=True)
for f in all_files:
    if os.path.exists(f):
        strip_comments(f)
        print(f"Cleaned {f}")
