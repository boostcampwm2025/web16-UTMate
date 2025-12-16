export default function TestPage() {
	return (
		<div className="flex flex-col h-screen border-4 border-primary-300 box-border bg-white">
			<header className="h-14 flex items-center justify-center border-b-4 border-primary-300 bg-primary-50 font-bold text-lg text-primary-800">
				🏠 Home
			</header>

			<div className="flex flex-1 overflow-hidden">
				<aside className="w-28 flex flex-col border-r-4 border-primary-300 bg-white">
					<div className="p-3 text-center font-bold text-sm border-b-2 border-primary-200 bg-primary-50 text-primary-700">
						미션 목록
					</div>
					<div className="flex flex-col gap-2 p-2 overflow-y-auto">
						{[1, 2, 3, 4, 5].map((item) => (
							<div
								key={item}
								className="h-20 border-2 border-primary-200 rounded-lg flex items-center justify-center text-center text-xs p-1 hover:bg-primary-50 hover:border-primary-400 cursor-pointer transition-all shadow-sm"
							>
								<span className="text-primary-600 font-medium">
									Mission
									<br />
									Type
									<br />#{item}
								</span>
							</div>
						))}
					</div>
				</aside>

				<section className="w-96 flex flex-col border-r-4 border-primary-300 bg-white min-w-[300px]">
					<div className="h-32 border-b-4 border-primary-300 flex flex-col items-center justify-center gap-3 p-4 bg-linear-to-b from-primary-50 to-white">
						<span className="text-sm font-medium text-primary-700">3 / 10</span>
						<div className="w-full bg-primary-100 rounded-full h-2.5">
							<div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
						</div>
					</div>

					<div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
						<h2 className="text-2xl font-bold text-primary-800">사용자 테스트</h2>
						<h3 className="text-lg font-semibold text-primary-600">첫 번째 미션</h3>
						<p className="text-gray-600 text-sm mt-2 leading-relaxed">
							미션 description 내용이
							<br />
							여기에 들어갑니다.
							<br />
							<span className="text-secondary-600 font-medium">주요 목표를 달성하세요!</span>
						</p>
					</div>

					<div className="h-24 p-3 flex gap-2 border-t-2 border-primary-100 bg-gray-50">
						<button className="flex-1 border-2 border-success-400 rounded-lg bg-success-50 font-bold hover:bg-success-100 hover:border-success-500 transition-all text-sm text-success-700 shadow-sm">
							✓ 완료
						</button>
						<button className="flex-1 border-2 border-secondary-400 rounded-lg bg-secondary-50 font-bold hover:bg-secondary-100 hover:border-secondary-500 transition-all text-sm text-secondary-700 shadow-sm">
							× 포기
						</button>
						<button className="flex-1 border-2 border-primary-400 rounded-lg bg-primary-50 font-bold hover:bg-primary-100 hover:border-primary-500 transition-all text-sm leading-tight text-primary-700 shadow-sm">
							전체
							<br />
							포기
						</button>
					</div>
				</section>

				<main className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-primary-50 text-xl font-bold text-primary-400">
					<div className="text-center">
						<div className="text-6xl mb-4">🎯</div>
						<div>프로덕트 화면</div>
					</div>
				</main>
			</div>
		</div>
	);
}
