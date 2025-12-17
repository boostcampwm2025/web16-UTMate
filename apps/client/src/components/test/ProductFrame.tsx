'use client';

import { useEffect, useMemo, useState } from 'react';

interface ProductFrameProps {
	productUrl: string;
	missionId: number;
}

export default function ProductFrame({ productUrl, missionId }: ProductFrameProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);

	// 쿠키에서 session_id 읽기
	useEffect(() => {
		const cookies = document.cookie.split(';');
		const sessionCookie = cookies.find((c) => c.trim().startsWith('session_id='));
		if (sessionCookie) {
			const id = sessionCookie.split('=')[1];
			setSessionId(id);
		}
	}, []);

	// lwt=true, session_id, mission_id 파라미터 추가
	const iframeUrl = useMemo(() => {
		try {
			const url = new URL(productUrl);
			url.searchParams.set('lwt', 'true');
			url.searchParams.set('mission_id', missionId.toString());
			if (sessionId) {
				url.searchParams.set('session_id', sessionId);
			}
			return url.toString();
		} catch (err) {
			console.error('[ProductFrame] Invalid URL:', err);
			return productUrl;
		}
	}, [productUrl, missionId, sessionId]);

	// mission_id 쿠키 설정
	useEffect(() => {
		// 개발 환경에서는 Secure 플래그 제거
		const isProduction = window.location.protocol === 'https:';
		const secureFlag = isProduction ? '; Secure' : '';
		document.cookie = `mission_id=${missionId}; path=/; SameSite=Lax${secureFlag}`;
	}, [missionId]);

	return (
		<main className="flex-1 flex flex-col bg-white relative">
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<div className="text-center">
						<div className="text-6xl mb-4 animate-bounce">🎯</div>
						<div className="text-primary-500 font-medium">프로덕트 로딩 중...</div>
					</div>
				</div>
			)}

			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
					<div className="text-center">
						<div className="text-6xl mb-4">⚠️</div>
						<div className="text-red-600 font-medium">{error}</div>
					</div>
				</div>
			)}

			<iframe
				src={iframeUrl}
				className="w-full h-full border-none"
				onLoad={() => {
					setIsLoading(false);
					setError(null);
				}}
				onError={() => {
					setIsLoading(false);
					setError('프로덕트 로드 실패');
				}}
				sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
				title="Product Frame"
			/>
		</main>
	);
}
