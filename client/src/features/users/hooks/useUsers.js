import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setFilter,
  setSearch, // اضافه شد
  setLimit,
  setPage,
  changeSystemStatus,
  updateUserThunk,
} from "../redux/userSlice";

export const useUsers = () => {
  const dispatch = useDispatch();
  const { list, loading, error, filter, page, pages, limit, search } =
    useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ۱. مدیریت دی‌بانس برای جلوگیری از درخواست‌های مکرر
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ۲. فچ کردن داده‌ها وقتی پارامترها تغییر می‌کنند
  useEffect(() => {
    // حیاتی: آپدیت کردن استیت سرچ در ریداکس تا در کش‌کی استفاده شود
    if (debouncedSearch !== search) {
      dispatch(setSearch(debouncedSearch));
    }

    dispatch(
      fetchUsers({
        status: filter,
        search: debouncedSearch,
        page,
        limit,
      }),
    );

    // منطق Prefetch برای صفحه بعد
    if (page < pages) {
      dispatch(
        fetchUsers({
          status: filter,
          search: debouncedSearch,
          page: page + 1,
          limit,
        }),
      );
    }
  }, [debouncedSearch, filter, page, pages, limit, dispatch]);

  const changeFilter = useCallback(
    (newFilter) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  const handleToggleActive = (user) => {
    dispatch(
      changeSystemStatus({
        userId: user._id,
        action: user.active ? "deactivate" : "activate",
      }),
    );
  };

  const handleSystemStatus = (userId, action) => {
    dispatch(changeSystemStatus({ userId, action }));
  };

  const handleUpdateUser = (userId, userData) => {
    return dispatch(updateUserThunk({ userId, userData })).unwrap();
  };

  const handlePageChange = useCallback(
    (newPage) => {
      dispatch(setPage(newPage));
    },
    [dispatch],
  );

  const changeLimit = (val) => {
    dispatch(setLimit(Number(val)));
  };

  return {
    users: list,
    isLoading: loading,
    usersError: error,
    currentFilter: filter,
    searchTerm, // برای Input استفاده شود
    page,
    pages,
    limit,
    changeLimit,
    handlePageChange,
    setSearchTerm, // تابع تغییر استیت محلی سرچ
    changeFilter,
    handleToggleActive,
    handleSystemStatus,
    handleUpdateUser,
  };
};
