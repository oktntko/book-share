import type { InvalidSubmissionContext } from "vee-validate";
import { openDialog } from "~/utils/ProgrammaticComponentHelper";

export async function handleInvalidSubmit(ctx: InvalidSubmissionContext) {
  if (import.meta.env.DEV) console.log(ctx);

  return openDialog({
    colorset: "yellow",
    icon: "bx:error",
    message: "入力値に誤りがあります。",
    confirmText: "OK",
    closeable: { escape: true, button: false, outside: true },
  });
}
