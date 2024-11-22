import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditableField from "./editable";
import { DEFAULT_TEXTS } from "@/constant";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import GLGIMG from "@/app/images/google.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export interface ListItem {
    id: string;
    logo: string;
    name: string;
    link: string;
}

interface PositiveTabsProps {
    setIsMainDivVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const fetchNewChannels = async (): Promise<ListItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                Array.from({ length: 10 }, (_, i) => ({
                    id: `${Math.random().toString(36).substr(2, 9)}`,
                    logo: GLGIMG,
                    name: `Channel ${i + 1}`,
                    link: `https://example.com/channel${i + 1}`,
                }))
            );
        }, 1000);
    });
};

const PositiveTabs: React.FC<PositiveTabsProps> = ({ setIsMainDivVisible }) => {
    const [editingSlug, setEditingSlug] = useState(false);
    const [reviewLinkSlug, setReviewLinkSlug] = useState(DEFAULT_TEXTS.positiveReviewTitle);

    const [items, setItems] = useState<ListItem[]>([
        {
            id: "1",
            logo: GLGIMG,
            name: "Google",
            link: "https://search.google.com/local/writereview?placeid=",
        },
        {
            id: "2",
            logo: GLGIMG,
            name: "Facebook",
            link: "https://www.facebook.com/",
        },
    ]);

    const [newChannels, setNewChannels] = useState<ListItem[]>([]);
    const [loadingNewChannels, setLoadingNewChannels] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [newLink, setNewLink] = useState<string>("");
    const [showMainContent, setShowMainContent] = useState(true);

    const handleEdit = (id: string, currentLink: string) => {
        setEditingItemId(id);
        setNewLink(currentLink);
    };

    const handleSave = (id: string) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, link: newLink } : item
            )
        );
        setEditingItemId(null);
        setNewLink("");
    };

    const handleCancel = () => {
        setEditingItemId(null);
        setNewLink("");
    };

    const handleDelete = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleFetchNewChannels = async () => {
        setLoadingNewChannels(true);
        const fetchedChannels = await fetchNewChannels();
        setNewChannels(fetchedChannels);
        setLoadingNewChannels(false);
        setShowMainContent(false);
        setIsMainDivVisible(false);
    };

    const handleAddNewChannel = (channel: ListItem) => {
        setItems((prevItems) => [...prevItems, channel]);
        setNewChannels((prevChannels) => prevChannels.filter((item) => item.id !== channel.id));
        setShowMainContent(true);
    };



    return (
        <>
            {showMainContent && (
                <div className="flex flex-col gap-5 items-start">
                    <div className="max-w-xl">
                        <EditableField
                            isEditing={editingSlug}
                            value={reviewLinkSlug}
                            onEdit={() => setEditingSlug(true)}
                            onSave={(newValue) => {
                                setReviewLinkSlug(newValue);
                                setEditingSlug(false);
                            }}
                            onCancel={() => setEditingSlug(false)}
                            renderValue={
                                <p>
                                    <span className="text-black">{reviewLinkSlug}</span>
                                </p>
                            }
                        />
                    </div>

                    {/* Channel Added List */}
                    <div className="w-full flex flex-col gap-8 max-w-xl">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-5 items-center flex-wrap rounded-md"
                            >
                                <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
                                    <Image
                                        src={item.logo}
                                        alt={`${item.name} logo`}
                                        width={40}
                                        height={40}
                                        className="rounded-sm"
                                    />
                                    <span className="flex-grow text-center font-semibold">
                                        {item.name}
                                    </span>
                                </div>
                                {editingItemId === item.id ? (
                                    <div className="w-full">
                                        <Input
                                            value={newLink}
                                            onChange={(e) => setNewLink(e.target.value)}
                                            autoFocus
                                            className="h-12 w-full"
                                        />
                                        <div className="flex gap-3 mt-4">
                                            <Button
                                                variant="ghost"
                                                className="text-[#B71D18] hover:bg-[#B71D18] hover:text-white font-bold"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="text-[#000] hover:bg-[#000] hover:text-white font-bold"
                                                onClick={() => handleSave(item.id)}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <Button
                                            variant="ghost"
                                            className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold"
                                            onClick={() => handleEdit(item.id, item.link)}
                                        >
                                            <PencilIcon className="h-4 w-4" /> Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <TrashIcon className="h-4 w-4" /> Delete
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!showMainContent && (
                <div className="grid grid-cols-3 gap-6">
                    {newChannels.map((channel) => (
                        <div key={channel.id} className="flex flex-col gap-4 items-start">
                            <div className="bg-gray-100 w-full h-14 rounded-lg p-3 flex items-center">
                                <Image
                                    src={channel.logo}
                                    alt={`${channel.name} logo`}
                                    width={40}
                                    height={40}
                                    className="rounded-sm"
                                />
                                <span className="flex-grow text-center font-semibold">
                                    {channel.name}
                                </span>
                            </div>
                            <Input
                                value={channel.link}
                                onChange={(e) => setNewLink(e.target.value)}
                                autoFocus
                                className="h-12 w-full"
                            />
                            <Button
                                variant="ghost"
                                className="flex items-center font-bold hover:bg-[#36B37E] hover:text-white py-6"
                                onClick={() => handleAddNewChannel(channel)}
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span>Add</span>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
            {loadingNewChannels && <p>Loading new channels...</p>}

            {showMainContent && (
                <Button
                    variant="ghost"
                    className="flex items-center font-bold hover:bg-[#36B37E] hover:text-white py-6 mt-5"
                    onClick={handleFetchNewChannels}
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add new channel</span>
                </Button>
            )}
        </>
    );
};

export default PositiveTabs;
