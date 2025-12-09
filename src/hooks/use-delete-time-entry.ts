import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import deleteTimeEntry from "@/data-layer/delete-time-entry";
import { store } from "@/store/root-store";
import { useAppDispatch } from "./index";
import { deleteTimeEntry as deleteTimeEntryAction } from "@/features/time-entries/time-entries-slice";

type Variables = string; // id

const useDeleteTimeEntry = (
  options?: UseMutationOptions<boolean, Error, Variables>
): UseMutationResult<boolean, Error, Variables> => {
  const dispatch = useAppDispatch();

  return useMutation<boolean, Error, Variables>(
    async (id: Variables) => {
      const jwt = store.getState()?.auth?.jwt ?? undefined;
      return await deleteTimeEntry(id, jwt);
    },
    {
      ...options,
      onSuccess(data, id, ctx) {
        try {
          dispatch(deleteTimeEntryAction(id));
        } catch (e) {
          // ignore
        }
        if (options && options.onSuccess) options.onSuccess(data, id, ctx);
      },
    }
  );
};

export default useDeleteTimeEntry;

