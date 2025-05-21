import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./Store";

// Dùng để dispatch các action trong redux
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Dùng để lấy state có kiểu RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
