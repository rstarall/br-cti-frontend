'use client';

import React from 'react';
import { Modal as AntModal } from 'antd';

interface ModalProps {
  title: string;
  content: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}

export const showConfirm = ({
  title,
  content,
  onOk,
  onCancel,
  okText = '确定',
  cancelText = '取消'
}: ModalProps) => {
  AntModal.confirm({
    title,
    content,
    onOk,
    onCancel,
    okText,
    cancelText,
    centered: true,
  });
};

export const showInfo = ({
  title,
  content,
  onOk,
  okText = '确定',
}: Omit<ModalProps, 'onCancel' | 'cancelText'>) => {
  AntModal.info({
    title,
    content,
    onOk,
    okText,
    centered: true,
  });
};

export const showSuccess = ({
  title,
  content,
  onOk,
  okText = '确定',
}: Omit<ModalProps, 'onCancel' | 'cancelText'>) => {
  AntModal.success({
    title,
    content,
    onOk,
    okText,
    centered: true,
  });
};

export const showError = ({
  title,
  content,
  onOk,
  okText = '确定',
}: Omit<ModalProps, 'onCancel' | 'cancelText'>) => {
  AntModal.error({
    title,
    content,
    onOk,
    okText,
    centered: true,
  });
};

export const showWarning = ({
  title,
  content,
  onOk,
  okText = '确定',
}: Omit<ModalProps, 'onCancel' | 'cancelText'>) => {
  AntModal.warning({
    title,
    content,
    onOk,
    okText,
    centered: true,
  });
};

export const Modal = AntModal;
