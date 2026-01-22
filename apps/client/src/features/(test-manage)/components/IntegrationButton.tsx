import type React from "react"

import { Link2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { cn } from "@/shared/utils"
import { openPopup } from "@/shared/utils/window"

interface IntegrationButtonProps {
  url: string | null;
  sdkStatus: boolean;
  testId: string;
}

export function IntegrationButton({ url, sdkStatus, testId }: IntegrationButtonProps) {
  const handleIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (url) {
      openPopup(
        `${url}?utm-sdk-verify=true&test-id=${testId}`,
        "SDK Installation Verification",
        600,
        400,
      )
    }
  }

  if (!url) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>-</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>연결된 사이트가 없습니다. 사이트 URL을 입력해주세요.</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    // TODO: MAZE에서는 연결된 사이트의 파비콘을 보여줌. 이후 수정 고려
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="mx-auto flex h-8 w-8 items-center justify-center rounded"
          onClick={handleIconClick}
        >
          <Link2
            className={cn("text-primary h-5 w-5", {
              "text-primary": sdkStatus,
              "text-destructive": !sdkStatus,
            })}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {sdkStatus ? (
          <p>{url}에 SDK연결이 완료되었습니다.</p>
        ) : (
          <p>{url}에 SDK연결이 확인되지 않았습니다.</p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
