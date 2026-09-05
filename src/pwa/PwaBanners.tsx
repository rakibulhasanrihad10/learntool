import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { useNetworkStatus } from './useNetworkStatus';
import { useInstallPrompt } from './install';
import { PWA_UPDATE_EVENT, requestAppUpdate } from './update';
import { WifiOff, Download, RefreshCw, X } from 'lucide-react';
import './PwaBanners.css';

function BannerShell({
  label,
  icon,
  title,
  body,
  actions,
  onDismiss,
  dismissLabel,
}: {
  label: string;
  icon: React.ReactNode;
  title: string;
  body?: string;
  actions?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}) {
  return (
    <div className="pwa-banner" role="status" aria-label={label}>
      <span className="pwa-banner__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="pwa-banner__text">
        <strong className="body-md">{title}</strong>
        {body && (
          <span className="body-sm pwa-banner__body">{body}</span>
        )}
      </div>
      <div className="pwa-banner__actions">
        {actions}
        {onDismiss && (
          <Button variant="text" size="sm" onClick={onDismiss} aria-label={dismissLabel ?? 'Dismiss'}>
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

export const NetworkBanner: React.FC = () => {
  const { t } = useTranslation();
  const online = useNetworkStatus();
  const wasOnline = useRef(online);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!wasOnline.current && online) {
      setShowReconnected(true);
      const timer = window.setTimeout(() => setShowReconnected(false), 4000);
      wasOnline.current = true;
      return () => window.clearTimeout(timer);
    }
    wasOnline.current = online;
    return undefined;
  }, [online]);

  if (online && !showReconnected) return null;
  const p = t.common.pwa;
  return (
    <BannerShell
      label={online ? p.online : p.offline}
      icon={<WifiOff size={18} />}
      title={online ? p.online : p.offline}
      body={online ? undefined : p.offlineBody}
    />
  );
};

export const InstallBanner: React.FC = () => {
  const { t } = useTranslation();
  const { eligible, promptInstall, dismiss } = useInstallPrompt();
  if (!eligible) return null;
  const p = t.common.pwa;
  return (
    <BannerShell
      label={p.installTitle}
      icon={<Download size={18} />}
      title={p.installTitle}
      body={p.installBody}
      actions={
        <Button variant="filled" size="sm" onClick={() => void promptInstall()}>
          {p.installAction}
        </Button>
      }
      onDismiss={dismiss}
      dismissLabel={p.dismissAction}
    />
  );
};

export const UpdateBanner: React.FC = () => {
  const { t } = useTranslation();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const show = () => setAvailable(true);
    window.addEventListener(PWA_UPDATE_EVENT, show);
    return () => window.removeEventListener(PWA_UPDATE_EVENT, show);
  }, []);

  if (!available) return null;
  const p = t.common.pwa;
  return (
    <BannerShell
      label={p.updateTitle}
      icon={<RefreshCw size={18} />}
      title={p.updateTitle}
      body={p.updateBody}
      actions={
        <Button variant="filled" size="sm" onClick={() => requestAppUpdate()}>
          {p.updateAction}
        </Button>
      }
      onDismiss={() => setAvailable(false)}
      dismissLabel={p.dismissAction}
    />
  );
};
