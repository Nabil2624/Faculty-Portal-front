export function sortMessagesChronologically(items) {
  return [...items].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );
}

export function dedupeMessages(items) {
  const seen = new Set();

  return items.filter((m) => {
    const key = m?.id ?? `${m?.senderId}-${m?.createdAt}-${m?.content}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getReceiverIdFromParticipants(conversation, currentUser) {
  const myId = currentUser?.userId ?? currentUser?.id;
  const participants = conversation?.participants ?? [];

  const other = participants.find((p) => {
    const pid = p.userId ?? p.id ?? p.participantId;
    return String(pid) !== String(myId);
  });

  return other?.userId ?? other?.id ?? other?.participantId ?? null;
}

export function getUnreadIncomingMessages(messages, currentUser, inFlightSet) {
  const myId = currentUser?.userId ?? currentUser?.id;

  return messages.filter((m) => {
    const senderId = m.senderId ?? m.userId;
    const alreadyRead =
      m.isRead === true || m.read === true || m.status === "Read";

    return (
      String(senderId) !== String(myId) &&
      !alreadyRead &&
      m.id != null &&
      !inFlightSet.has(m.id)
    );
  });
}
