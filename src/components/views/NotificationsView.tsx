"use client";

import React from "react";
import { Bell, ClipboardList, Clock3, LucideIcon } from "lucide-react";
import { Notice, NotificationsData, User } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelHead } from "@/components/common/PanelHead";
import { EmptyState } from "@/components/common/EmptyState";
import { isDepartmentAdmin } from "@/utils/roles";

interface NoticePanelProps {
  title: string;
  subtitle: string;
  headIcon: LucideIcon;
  noticeIcon: LucideIcon;
  warning?: boolean;
  notices: Notice[];
  emptyMessage: string;
  getDetail: (notice: Notice) => string;
}

function NoticePanel({
  title,
  subtitle,
  headIcon: HeadIcon,
  noticeIcon: NoticeIcon,
  warning = false,
  notices,
  emptyMessage,
  getDetail
}: NoticePanelProps) {
  return (
    <section className="panel">
      <PanelHead title={title} subtitle={subtitle} action={<HeadIcon size={18} className="icon-muted" />} />
      {notices.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        notices.map((notice, index) => (
          <div className="notice-row" key={`${notice.id}-${index}`}>
            <div className={`notice-icon ${warning ? "notice-warning" : ""}`}>
              <NoticeIcon size={18} />
            </div>
            <div>
              <b>{notice.inventory_name}</b>
              <p>
                {notice.borrower_name} · {notice.department_name}
              </p>
              <span>{getDetail(notice)}</span>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

interface NotificationsViewProps {
  user: User;
  notifications: NotificationsData;
  onBack: () => void;
}

export function NotificationsView({ user, notifications, onBack }: NotificationsViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="PEMBERITAHUAN"
        title={`Notifikasi ${isDepartmentAdmin(user) ? `Departemen ${user.department_name}` : ""}`.trim()}
        description="Pengajuan baru, pengembalian yang menunggu, dan pengingat jatuh tempo."
        onBack={onBack}
      />

      <div className="notification-columns">
        <NoticePanel
          title="Perlu ditindaklanjuti"
          subtitle={`${notifications.pending.length} pemberitahuan`}
          headIcon={Bell}
          noticeIcon={ClipboardList}
          notices={notifications.pending}
          emptyMessage="Tidak ada pemberitahuan baru."
          getDetail={(n) => (n.due_date ? `Jatuh tempo ${n.due_date}` : "Memerlukan tindakan penanggung jawab")}
        />
        <NoticePanel
          title="Pengingat pengembalian"
          subtitle="Jatuh tempo dalam dua hari"
          headIcon={Clock3}
          noticeIcon={Clock3}
          warning
          notices={notifications.due_returns}
          emptyMessage="Tidak ada barang yang mendekati jatuh tempo."
          getDetail={(n) => `Jatuh tempo ${n.due_date}`}
        />
      </div>
    </>
  );
}
