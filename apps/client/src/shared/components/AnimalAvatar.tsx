import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/utils';

const ANIMAL_IMAGE_MAP: Record<string, string> = {
  다람쥐: 'chipmunk.webp',
  물고기: 'clownfish.webp',
  사슴: 'deer.webp',
  코끼리: 'elephant.webp',
  여우: 'fox.webp',
  개구리: 'frog.webp',
  기린: 'giraffe.webp',
  양: 'lamb.webp',
  사자: 'lion.webp',
  라마: 'llama.webp',
  강아지: 'miniature-schnauzer.webp',
  문어: 'octopus.webp',
  부엉이: 'owl.webp',
  판다: 'panda.webp',
  펠리컨: 'pelican.webp',
  펭귄: 'penguin.webp',
  북극곰: 'polar-bear.webp',
  토끼: 'rabbit.webp',
  참새: 'sparrow.webp',
  청설모: 'squirrel.webp',
  거북이: 'turtle.webp',
  바다코끼리: 'walrus.webp',
};

interface AnimalAvatarProps {
  name: string;
  className?: string;
}

export function AnimalAvatar({ name, className }: AnimalAvatarProps) {
  // 디폴트 이미지는 귀여운 다람쥐입니다.
  const fileName = ANIMAL_IMAGE_MAP[name] || ANIMAL_IMAGE_MAP['다람쥐'];

  return (
    <Avatar className={cn('bg-white', className)}>
      <AvatarImage src={`/images/icons/${fileName}`} alt={name} className="object-cover" />
    </Avatar>
  );
}
