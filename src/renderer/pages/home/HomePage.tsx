import React, { useState } from 'react';
import './HomePage.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Content from '../content/Content';
import TodoApp from '../todo/NewTodo';

interface FolderType {
    id: number;
    name: string;
    children: FolderType[];
    items: ItemType[];
}

type ItemType = {
    id: number;
    type: 'Note' | 'Task' | 'Bookmark';
    content: string;
};

const HomePage = () => {
    const [folders, setFolders] = useState<FolderType[]>([]);
    const navigate = useNavigate();

    const handleFolderClick = (folderId: number) => {
        console.log('Folder clicked with ID:', folderId);

    };

    const handleItemClick = (itemId: number, type:string) => {
        console.log('Item clicked with ID:', itemId , 'Type' , type);
        navigate(`/content/${itemId}/${type}`);
    };

    const makeNewFolder = (parentId: number | null = null) => {
        const newFolder: FolderType = {
            id: Date.now(),
            name: `Folder`,
            children: [],
            items: []
        };

        setFolders((prevFolders) => {
            if (parentId === null) {
                return [...prevFolders, newFolder];
            } else {
                const addFolderToParent = (folders: FolderType[]): FolderType[] => {
                    return folders.map((folder) => {
                        if (folder.id === parentId) {
                            return {
                                ...folder,
                                children: [...folder.children, newFolder]
                            };
                        } else {
                            return {
                                ...folder,
                                children: addFolderToParent(folder.children)
                            };
                        }
                    });
                };
                return addFolderToParent(prevFolders);
            }
        });
    };

    const addItemToFolder = (folderId: number, itemType: 'Note' | 'Task' | 'Bookmark') => {
        const newItem: ItemType = {
            id: Date.now(),
            type: itemType,
            content: `${itemType} Content ${Date.now()}`
        };

        setFolders((prevFolders) => {
            const addItem = (folders: FolderType[]): FolderType[] => {
                return folders.map((folder) => {
                    if (folder.id === folderId) {
                        return {
                            ...folder,
                            items: [...folder.items, newItem]
                        };
                    } else {
                        return {
                            ...folder,
                            children: addItem(folder.children)
                        };
                    }
                });
            };
            return addItem(prevFolders);
        });
    };

    const removeFolder = (folderId: number) => {
        setFolders((prevFolders) => {
            const remove = (folders: FolderType[]): FolderType[] => {
                return folders.filter((folder) => folder.id !== folderId).map((folder) => ({
                    ...folder,
                    children: remove(folder.children)
                }));
            };
            return remove(prevFolders);
        });
    };

    const removeItem = (folderId: number, itemId: number) => {
        setFolders((prevFolders) => {
            const remove = (folders: FolderType[]): FolderType[] => {
                return folders.map((folder) => {
                    if (folder.id === folderId) {
                        return {
                            ...folder,
                            items: folder.items.filter((item) => item.id !== itemId)
                        };
                    } else {
                        return {
                            ...folder,
                            children: remove(folder.children)
                        };
                    }
                });
            };
            return remove(prevFolders);
        });
    };

    return (
        <div className="homepage">
            <div className="sidebar">
                <button className="new-root-btn cursor-pointer" onClick={() => makeNewFolder()}>
                    ➕ New Root Folder
                </button>
                <FolderList
                    folders={folders}
                    onAddFolder={makeNewFolder}
                    onAddItem={addItemToFolder}
                    onRemoveFolder={removeFolder}
                    onRemoveItem={removeItem}
                    onFolderClick={handleFolderClick} 
                    onItemClick={handleItemClick} 
                />
            </div>
            <div className="content-area">

                <Routes>
                    <Route path='/content/:id/:type' element={<Content />} />
                    <Route path='/todo' element={<TodoApp />} />
                </Routes>
            </div>
        </div>
    );
};

const FolderList = ({
    folders,
    onAddFolder,
    onAddItem,
    onRemoveFolder,
    onRemoveItem,
    onFolderClick,
    onItemClick
}: {
    folders: FolderType[];
    onAddFolder: (parentId: number | null) => void;
    onAddItem: (folderId: number, itemType: 'Note' | 'Task' | 'Bookmark') => void;
    onRemoveFolder: (folderId: number) => void;
    onRemoveItem: (folderId: number, itemId: number) => void;
    onFolderClick: (folderId: number) => void; 
    onItemClick: (itemId: number, type:string) => void;  
}) => {
    return (
        <div className="folder-list">
            {folders.map((folder) => (
                <div key={folder.id} className="folder-item">
                    <Folder
                        folder={folder}
                        onAddFolder={onAddFolder}
                        onAddItem={onAddItem}
                        onRemoveFolder={onRemoveFolder}
                        onRemoveItem={onRemoveItem}
                        onFolderClick={onFolderClick} 
                        onItemClick={onItemClick} 
                    />
                </div>
            ))}
        </div>
    );
};

const Folder = ({
    folder,
    onAddFolder,
    onAddItem,
    onRemoveFolder,
    onRemoveItem,
    onFolderClick,
    onItemClick
}: {
    folder: FolderType;
    onAddFolder: (parentId: number | null) => void;
    onAddItem: (folderId: number, itemType: 'Note' | 'Task' | 'Bookmark') => void;
    onRemoveFolder: (folderId: number) => void;
    onRemoveItem: (folderId: number, itemId: number) => void;
    onFolderClick: (folderId: number) => void;  // Prop to handle folder click
    onItemClick: (itemId: number, itemType:string) => void;  // Prop to handle item click
}) => {
    return (
        <div className="folder">
            <div className="folder-header" onClick={() => onFolderClick(folder.id)}>
                <span className="folder-name">{folder.name}</span>
                <button className="add-btn" onClick={() => onAddFolder(folder.id)}>➕</button>
                <button className="remove-btn" onClick={() => onRemoveFolder(folder.id)}>🗑️</button>
                <button className="add-btn" onClick={() => onAddItem(folder.id, 'Note')}>📓</button>
                <button className="add-btn" onClick={() => onAddItem(folder.id, 'Task')}>📝</button>
                <button className="add-btn" onClick={() => onAddItem(folder.id, 'Bookmark')}>🔖</button>
            </div>
            <div className="items-list">
                {folder.items.map((item) => (
                    <div
                        key={item.id}
                        className={`item ${item.type.toLowerCase()} cursor-pointer`}
                        onClick={() => onItemClick(item.id, item.type)} 
                    >
                        <strong>{item.type}</strong>
                        <button className="remove-btn" onClick={() => onRemoveItem(folder.id, item.id)}>🗑️</button>
                    </div>
                ))}
            </div>
            {folder.children.length > 0 && (
                <FolderList
                    folders={folder.children}
                    onAddFolder={onAddFolder}
                    onAddItem={onAddItem}
                    onRemoveFolder={onRemoveFolder}
                    onRemoveItem={onRemoveItem}
                    onFolderClick={onFolderClick}  
                    onItemClick={onItemClick}  
                />
            )}
        </div>
    );
};

export default HomePage;
