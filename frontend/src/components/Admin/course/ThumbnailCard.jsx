import { Card, CardContent, Typography } from "@mui/material";
import AvatarUpload from "../user/drawer/AvatarUpload";

export default function ThumbnailCard({ editMode, data, thumbnailPreview, onSelectFile }) {

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" mb={1}>Thumbnail</Typography>
                <Typography variant="body2" mb={1}>Thumbnail size max 2MB</Typography>
                <AvatarUpload
                    initialAvatarUrl={editMode && data ? data.thumbnail : thumbnailPreview}
                    onFileSelect={onSelectFile}
                />
            </CardContent>
        </Card>
    );
}
