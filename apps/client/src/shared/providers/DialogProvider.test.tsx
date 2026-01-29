import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialogProvider } from './DialogProvider';
import { useDialogStore, DIALOG_INITIAL_STATE } from '@/shared/stores/useDialogStore';

describe('DialogProvider', () => {
  beforeEach(() => {
    useDialogStore.setState(DIALOG_INITIAL_STATE);
  });

  it('confirm 호출 시 다이얼로그가 화면에 나타나야 한다', async () => {
    render(<DialogProvider />);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

    const { confirm } = useDialogStore.getState();
    act(() => {
      confirm('삭제 확인', '정말 삭제하시겠습니까?');
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText('삭제 확인')).toBeInTheDocument();
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
  });

  it('확인 버튼 클릭 시 true를 반환하고 다이얼로그가 닫혀야 한다', async () => {
    const user = userEvent.setup();
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    let resultPromise: Promise<boolean>;
    act(() => {
      resultPromise = confirm('제목', '설명');
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: '확인' }));

    const result = await resultPromise!;
    expect(result).toBe(true);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('취소 버튼 클릭 시 false를 반환하고 다이얼로그가 닫혀야 한다', async () => {
    const user = userEvent.setup();
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    let resultPromise: Promise<boolean>;
    act(() => {
      resultPromise = confirm('제목', '설명');
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: '취소' }));

    const result = await resultPromise!;
    expect(result).toBe(false);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('isAlert: true일 때 destructive 스타일이 적용되어야 한다', async () => {
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    act(() => {
      confirm('경고', '위험한 작업입니다', null, { isAlert: true });
    });

    await waitFor(() => {
      const confirmButton = screen.getByRole('button', { name: '확인' });
      expect(confirmButton).toHaveClass('bg-destructive');
    });
  });

  it('hasCancel: false일 때 취소 버튼이 없어야 한다', async () => {
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    act(() => {
      confirm('알림', '작업이 완료되었습니다.', null, { hasCancel: false });
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
  });

  it('커스텀 React 컴포넌트를 content로 렌더링할 수 있어야 한다', async () => {
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    const customContent = (
      <div>
        <p>커스텀 컨텐츠입니다</p>
        <ul>
          <li>항목 1</li>
          <li>항목 2</li>
        </ul>
      </div>
    );
    act(() => {
      confirm('커스텀 다이얼로그', '', customContent);
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('커스텀 컨텐츠입니다')).toBeInTheDocument();
    expect(screen.getByText('항목 1')).toBeInTheDocument();
    expect(screen.getByText('항목 2')).toBeInTheDocument();
  });

  it('로딩 중일 때는 바깥을 클릭해도 닫히지 않아야 한다', async () => {
    const user = userEvent.setup();
    render(<DialogProvider />);

    // 1. 다이얼로그 열기
    const { confirm } = useDialogStore.getState();
    let resultPromise: Promise<boolean>;
    act(() => {
      // 로딩 상태를 시뮬레이션하기 전에는 일단 열려야 함 (isLoading은 내부 상태 or store 상태)
      // useDialogStore에는 isLoading을 직접 제어하는 액션이 없지만,
      // confirm이 호출되면 자동으로 열림.
      // isLoading 상태를 테스트하려면 store의 상태를 직접 조작하거나
      // confirm의 결과를 기다리는 동안 isLoading이 true가 되는 메커니즘이 있어야 함.
      // 현재 DialogProvider는 store의 isLoading을 구독함.
      resultPromise = confirm('로딩 테스트', '');
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // 2. 강제로 로딩 상태로 변경
    act(() => {
      useDialogStore.setState({ isLoading: true });
    });

    // 3. 바깥 클릭 시뮬레이션 (ESC 키로 대체 테스트 가능, Radix Dialog는 ESC도 막힘)
    // pointerDownOutside 이벤트는 JSDOM에서 완벽하게 시뮬레이션하기 어려울 수 있으므로
    // ESC 키 이벤트를 통해 '닫기 시도'가 막히는지 확인하는 것이 일반적임.
    await user.keyboard('{Escape}');

    // 4. 여전히 닫히지 않았는지 확인
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // 5. 로딩 해제
    act(() => {
      useDialogStore.setState({ isLoading: false });
    });

    // 6. 다시 ESC
    await user.keyboard('{Escape}');

    // 7. 닫힘 확인
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('로딩 중이 아닐 때는 바깥을 클릭하면 닫혀야 한다', async () => {
    const user = userEvent.setup();
    render(<DialogProvider />);

    // 1. 다이얼로그 열기
    const { confirm } = useDialogStore.getState();
    act(() => {
      confirm('닫기 테스트', '');
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // 2. 바깥 클릭 (ESC로 시뮬레이션)
    await user.keyboard('{Escape}');

    // 3. 닫힘 확인
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
