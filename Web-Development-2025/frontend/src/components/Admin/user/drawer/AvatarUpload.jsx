import { useState, useRef, ChangeEvent } from "react";



const AvatarUpload = ({
    onFileSelect,
    initialAvatarUrl
}) => {
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file) => {
        setError("");

        // Check file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        // Check file size (100KB - 500KB)
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB > 2000) {
            setError("Image is too large. Maximum size is 2MB");
            return;
        }

        // Valid file, create preview and pass to parent
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            setAvatarUrl(result);
            onFileSelect(file);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                {avatarUrl ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={avatarUrl}
                            alt="Avatar preview"
                            className="w-full h-60 object-contain mb-2"
                        />
                        <span className="text-sm text-gray-600">Click or drag to change avatar</span>
                    </div>
                ) : (
                    <div className="py-4">
                        <div className="flex justify-center mb-2">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </div>
                        <p className="text-gray-700">Click or drag image to upload avatar</p>
                        <p className="text-sm text-gray-500 mt-1">Image size max 2MB</p>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
        </div>
    );
};

export default AvatarUpload;