import React from 'react';
import { IconCheck, IconX } from "@tabler/icons";

export const SuccessNotification = {
    closeButtonProps: { 'aria-label': 'Hide notification' },
    icon: <IconCheck size={18} />,
    color: "teal",
    title: "Success",
    message: "Changes have been saved",
};

export const FailureNotification = {
    closeButtonProps: { 'aria-label': 'Hide notification' },
    icon: <IconX size={18} />,
    color: "red",
    title: "Failure",
    message: "Changes could not be saved",
};