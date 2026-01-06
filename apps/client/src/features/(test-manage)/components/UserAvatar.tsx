import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

interface UserAvatarProps {
  name: string;
  imageUrl?: string | null;
}

export function UserAvatar({ name, imageUrl }: UserAvatarProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
          <AvatarFallback className="bg-gray-400 text-sm font-medium text-white">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
}
