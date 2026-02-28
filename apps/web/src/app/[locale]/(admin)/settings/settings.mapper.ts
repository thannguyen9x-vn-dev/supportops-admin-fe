import type { UpdateProfileRequest, UserPreferences, UserProfile } from "@supportops/contracts";

import type { CountryCode } from "@/shared/constants/countries";

import type { NotificationPreference, ProfileFormValues } from "./settings.types";

const DEFAULT_COUNTRY = "US" as CountryCode;

export function toProfileFormValues(profile: UserProfile): ProfileFormValues {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    birthday: profile.birthday ?? "",
    phoneNumber: profile.phone ?? "",
    address: profile.address ?? "",
    country: (profile.country || DEFAULT_COUNTRY) as CountryCode,
    email: profile.email,
    organization: profile.organization ?? "",
    zipCode: profile.zipCode ?? "",
    city: profile.city ?? "",
    department: profile.department ?? ""
  };
}

export function toUpdateProfileRequest(values: ProfileFormValues): UpdateProfileRequest {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    birthday: values.birthday,
    phone: values.phoneNumber,
    address: values.address,
    country: values.country,
    organization: values.organization,
    zipCode: values.zipCode,
    city: values.city,
    department: values.department
  };
}

export function toNotificationPreferences(preferences: UserPreferences): NotificationPreference[] {
  return [
    { key: "companyNews", group: "alerts", enabled: preferences.companyNews },
    { key: "accountActivity", group: "alerts", enabled: preferences.accountActivity },
    { key: "meetupsNearYou", group: "alerts", enabled: preferences.meetupsNearYou },
    { key: "newMessages", group: "alerts", enabled: preferences.newMessages },
    { key: "ratingReminders", group: "email", enabled: preferences.ratingReminders },
    { key: "itemUpdateNotifications", group: "email", enabled: preferences.itemUpdateNotif },
    { key: "itemCommentNotifications", group: "email", enabled: preferences.itemCommentNotif },
    { key: "buyerReviewNotifications", group: "email", enabled: preferences.buyerReviewNotif }
  ];
}

export function toUserPreferences(preferences: NotificationPreference[]): UserPreferences {
  const find = (key: NotificationPreference["key"]) =>
    preferences.find((item) => item.key === key)?.enabled ?? false;

  return {
    companyNews: find("companyNews"),
    accountActivity: find("accountActivity"),
    meetupsNearYou: find("meetupsNearYou"),
    newMessages: find("newMessages"),
    ratingReminders: find("ratingReminders"),
    itemUpdateNotif: find("itemUpdateNotifications"),
    itemCommentNotif: find("itemCommentNotifications"),
    buyerReviewNotif: find("buyerReviewNotifications")
  };
}
