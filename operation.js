//in this file we will be have impure functions

import data from './store.js';
import { isNameUnique } from './util.js';

function addItem(item) {
    const itemList = document.createElement("div");
    itemList.classList.add("item");
        
    const icon = document.createElement("span");
    icon.classList.add(`${item.type}-icon`);
    itemList.appendChild(icon);

    const itemName = document.createElement("span");
    itemName.textContent = item.name;
    itemList.appendChild(itemName);

    const buttonContainer = document.createElement("div");
    itemList.classList.add("button-container");

    if (item.type === "folder") { 
        const createRootFolder = document.createElement("button");
        createRootFolder.textContent = "Create Folder at Root";
        createRootFolder.setAttribute("id","btnId")
        createRootFolder.addEventListener("click", () => {
            let newFolderName = prompt("Enter a name for the new folder:");
            if (!newFolderName) {
                alert("Folder Name at least one character");
                return; 
            }

            while (!isNameUnique(newFolderName, { children: data }, null)) {
                alert("Folder Name Should be unique...\n Please try again");
                return;
            }

            const newFolder = {
                name: newFolderName,
                type: "folder",
                expanded: true,
                children: []
            };
            data.push(newFolder);
            renderFileExplorer();
        });
        buttonContainer.appendChild(createRootFolder);
    
    }

    if (item.type === "folder") {

     const expandCollapse = document.createElement("button");
        expandCollapse.setAttribute("id","btnId");
        expandCollapse.textContent = item.expanded ? "▼" : "▶";
        expandCollapse.addEventListener("click", () => {
            item.expanded = !item.expanded;
            renderFileExplorer();
        });

        itemList.appendChild(expandCollapse);

        const addFolder = document.createElement("button");
        addFolder.setAttribute("id","btnId");
        addFolder.textContent = "📁";
        addFolder.addEventListener("click", () => {
            const folderName = prompt("Enter folder name:");
            if (!folderName) {
                alert("Folder Name at least one character");
                return; 
            }
            while (!isNameUnique(folderName, item, null)) {
                alert("Folder Name Should be unique...\n Please try again");
                return;
            }

            let uniqueName = folderName;
            // let counter = 1;
            // while (!isNameUnique(uniqueName, item)) {
            //     uniqueName = `${folderName} (${counter})`;
            //     counter++;
            // }
            const newFolder = {
                name: uniqueName,
                type: "folder",
                expanded: true,
                children: []
            };
            item.children.push(newFolder);
            renderFileExplorer();
        });
        itemList.appendChild(addFolder);

        const addFile = document.createElement("button");
        addFile.setAttribute("id","btnId");
        addFile.textContent = "📄";
        addFile.addEventListener("click", () => {
            const fileName = prompt("Enter File name:");
            if (!fileName) {
                alert("File Name at least one character")
                return; 
            }
            while (!isNameUnique(fileName, item, null)) {
                alert("Folder Name Should be unique...\n Please try again");
                return;
            }

            let uniqueName = fileName;
            let counter = 1;
            while (!isNameUnique(uniqueName, item)) {
                uniqueName = `${fileName} (${counter})`;
                counter++;
            }
            const newFile = {
                name: uniqueName,
                type: "file"
            };
            item.children.push(newFile);
            renderFileExplorer();
        });
        itemList.appendChild(addFile);
    }

    const deleteFileFolder = document.createElement("button");
    deleteFileFolder.setAttribute("id","btnId");
    deleteFileFolder.textContent = "🗑️";
    deleteFileFolder.addEventListener("click", () => {
        const parentChildren = item.parent ? item.parent.children : data;
        const index = parentChildren.indexOf(item);
        if (index !== -1) {
            parentChildren.splice(index, 1);
            renderFileExplorer();
        }
    });
    itemList.appendChild(deleteFileFolder);

    return itemList;
}

function renderFileExplorer() {
    const fileStructure = document.getElementById("file-structure");
    fileStructure.innerHTML = '';

    const generateFolderStructure = (parent, items) => {
        const fileStructure = document.getElementById("file-structure");
    fileStructure.innerHTML = '';

    const createRootFolder = document.createElement("button");
    createRootFolder.textContent = "Create Folder at Root";
    createRootFolder.addEventListener("click", () => {
        let newFolderName = prompt("Enter a name for the new folder:");
        if (!newFolderName) {
            alert("Folder name at least one character");
            return; 
        }

        while (!isNameUnique(newFolderName, { children: data }, null)) {
            newFolderName = prompt("Folder name already exists. Enter a different name:");
            if (!newFolderName) {
                return; 
            }
        }

        const newFolder = {
            name: newFolderName,
            type: "folder",
            expanded: true,
            children: []
        };
        data.push(newFolder);
        renderFileExplorer();
    });
    fileStructure.appendChild(createRootFolder);


        const childrenList = document.createElement("div");
        childrenList.classList.add("children-list");

        items.forEach(item => {
            item.parent = parent ? parent.itemData : null; 

            const listItem = addItem(item);
            listItem.itemData = item; 
            childrenList.appendChild(listItem);

            if (item.expanded && item.children.length > 0) {
                generateFolderStructure(listItem, item.children);
            }
        });

        parent.appendChild(childrenList);
    };

    generateFolderStructure(fileStructure, data);
}

export { addItem, renderFileExplorer };

