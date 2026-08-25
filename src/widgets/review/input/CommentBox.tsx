import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';

import type { DataEntry } from '@data/DataTypes';
import { useTargetDataContext } from '@data/TargetDataProvider';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  entry: DataEntry;
  onCommentFinish: () => void;
};
const CommentBox: React.FC<Props> = ({ entry, onCommentFinish }) => {
  const { uitext } = useInterfaceTranslation();
  const { getTranslationInfo, editTranslation } = useTargetDataContext();
  const { comment } = getTranslationInfo(entry) ?? {};

  const [currentComment, setCurrentComment] = useState(comment ?? '');

  // Update currentComment when the comment from context changes
  useEffect(() => {
    setCurrentComment(comment ?? '');
  }, [comment]);

  const saveComment = useCallback(() => {
    editTranslation(entry.id, { comment: currentComment });
  }, [currentComment, editTranslation, entry.id]);
  const saveAndCloseComment = useCallback(() => {
    saveComment();
    onCommentFinish();
  }, [saveComment, onCommentFinish]);
  const handleCommentKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== 'Enter' || event.shiftKey) return;
      event.preventDefault();
      saveAndCloseComment();
    },
    [saveAndCloseComment],
  );

  return (
    <textarea
      data-testid="comment-input"
      placeholder={uitext('vote.writeCommentHere')}
      onBlur={saveComment}
      onChange={(e) => setCurrentComment(e.target.value)}
      onKeyDown={handleCommentKeyDown}
      className="border p-1 rounded w-full"
      value={currentComment}
      style={{ width: '100%' }}
    />
  );
};

export default CommentBox;
