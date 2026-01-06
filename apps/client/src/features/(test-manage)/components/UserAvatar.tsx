interface UserAvatarProps {
  name: string;
  imageUrl?: string | null;
}

export function UserAvatar({ name, imageUrl }: UserAvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-medium text-white">
      {name.charAt(0)}
    </div>
  );
}


