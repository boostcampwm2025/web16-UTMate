import Link from 'next/link';

interface TestHeaderProps {
	testName?: string;
}

export default function TestHeader({ testName }: TestHeaderProps) {
	return (
		<header className="h-14 flex items-center justify-between border-b-4 border-primary-300 bg-primary-50 px-6">
			<Link
				href="/"
				className="flex items-center gap-2 font-bold text-lg text-primary-800 hover:text-primary-600 transition-colors"
			>
				🏠 <span>Home</span>
			</Link>

			{testName && <span className="text-sm text-primary-600 font-medium">{testName}</span>}
		</header>
	);
}
