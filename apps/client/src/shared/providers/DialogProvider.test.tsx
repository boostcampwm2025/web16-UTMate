import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
    confirm('삭제 확인', '정말 삭제하시겠습니까?');

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
    expect(screen.getByText('삭제 확인')).toBeInTheDocument();
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
  });

  it('확인 버튼 클릭 시 true를 반환하고 다이얼로그가 닫혀야 한다', async () => {
    const user = userEvent.setup();
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    const resultPromise = confirm('제목', '설명');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: '확인' }));

    const result = await resultPromise;
    expect(result).toBe(true);

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('취소 버튼 클릭 시 false를 반환하고 다이얼로그가 닫혀야 한다', async () => {
    const user = userEvent.setup();
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    const resultPromise = confirm('제목', '설명');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: '취소' }));

    const result = await resultPromise;
    expect(result).toBe(false);

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('isAlert: true일 때 destructive 스타일이 적용되어야 한다', async () => {
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    confirm('경고', '위험한 작업입니다', null, { isAlert: true });

    await waitFor(() => {
      const confirmButton = screen.getByRole('button', { name: '확인' });
      expect(confirmButton).toHaveClass('bg-destructive');
    });
  });

  it('hasCancel: false일 때 취소 버튼이 없어야 한다', async () => {
    render(<DialogProvider />);

    const { confirm } = useDialogStore.getState();
    confirm('알림', '작업이 완료되었습니다.', null, { hasCancel: false });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
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
    confirm('커스텀 다이얼로그', '', customContent);

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.getByText('커스텀 컨텐츠입니다')).toBeInTheDocument();
    expect(screen.getByText('항목 1')).toBeInTheDocument();
    expect(screen.getByText('항목 2')).toBeInTheDocument();
  });
});
