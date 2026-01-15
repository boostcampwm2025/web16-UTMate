export const openPopup = (url: string, title: string, w: number, h: number) => {
  // 듀얼 모니터 환경을 고려한 부모 창의 좌표 계산
  const duplicateScale = window.devicePixelRatio || 1;

  // 브라우저의 현재 위치와 크기
  const windowLeft = window.screenLeft ?? window.screenX;
  const windowTop = window.screenTop ?? window.screenY;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

  // 팝업을 중앙에 위치시키기 위한 좌표 계산
  const systemZoom = windowWidth / window.screen.availWidth;
  const left = (windowWidth - w) / 2 / systemZoom + windowLeft;
  const top = (windowHeight - h) / 2 / systemZoom + windowTop;

  // 윈도우 팝업 오픈
  const newWindow = window.open(
    url,
    title,
    `
        scrollbars=yes,
        width=${w / systemZoom}, 
        height=${h / systemZoom}, 
        top=${top}, 
        left=${left}
      `,
  );

  // 팝업이 차단되지 않고 열렸다면 포커스 이동
  if (newWindow) newWindow.focus();

  return newWindow;
};
