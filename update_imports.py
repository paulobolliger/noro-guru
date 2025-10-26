import os
import re

def update_imports(directory):
    print(f"Starting import update in directory: {directory}")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".ts", ".tsx")):
                filepath = os.path.join(root, file)
                print(f"Processing file: {filepath}")
                with open(filepath, 'r') as f:
                    content = f.read()

                # Flexible regex to handle single or double quotes
                new_content = re.sub(r'from ["\']@/lib/(.*)["\'];', r'from "@lib/\1";', content)
                new_content = re.sub(r'from ["\']@/components/ui/(.*)["\'];', r'from "@ui/\1";', new_content)
                new_content = re.sub(r'from ["\']@/types/(.*)["\'];', r'from "@types/\1";', new_content)
                new_content = re.sub(r'from ["\']@/components/(.*)["\'];', r'from "@/components/\1";', new_content)

                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated imports in: {filepath}")
    print("Import update finished.")

update_imports("apps")
