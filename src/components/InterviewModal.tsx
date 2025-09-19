import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { InterviewRecord } from '../types';
import { format } from 'date-fns';

// 新しい空の記録を作成するヘルパー関数
const createNewRecord = (): InterviewRecord => ({
  id: Date.now().toString(),
  workName: '',
  theme: '',
  count: '1', // デフォルト値を'1'に設定
  memo: ''
});

interface InterviewModalProps {
  show: boolean;
  date: Date;
  records: InterviewRecord[];
  onClose: () => void;
  onSave: (records: InterviewRecord[]) => void;
  onDeleteDate: () => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({ show, date, records, onClose, onSave, onDeleteDate }) => {
  const [localRecord, setLocalRecord] = useState<InterviewRecord>(createNewRecord());
  const [errors, setErrors] = useState<{ [field: string]: string }>({});

  useEffect(() => {
    setLocalRecord(records.length > 0 ? { ...records[0] } : createNewRecord());
    setErrors({});
  }, [records, show]);

  const handleRecordChange = (field: keyof InterviewRecord, value: string) => {
    setLocalRecord(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    if (!localRecord) return;

    const newErrors: { [field: string]: string } = {};
    let hasError = false;

    if (localRecord.workName.trim() === '') {
      newErrors.workName = 'ワーク名は必須です。';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      alert('必須項目が入力されていません。');
      return;
    }
    onSave([localRecord]);
  };

  const handleDelete = () => {
    if (window.confirm('この日の記録を削除しますか？')) {
      onDeleteDate();
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{format(date, 'yyyy年M月d日')} の記録</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">ワーク名</label>
              <input
                type="text"
                className={`form-control ${errors.workName ? 'is-invalid' : ''}`}
                value={localRecord.workName}
                onChange={(e) => handleRecordChange('workName', e.target.value)}
              />
              {errors.workName && (
                <div className="invalid-feedback d-block">{errors.workName}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">テーマ</label>
              <input
                type="text"
                className="form-control"
                value={localRecord.theme}
                onChange={(e) => handleRecordChange('theme', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label">回数</label>
              <select className="form-select" value={localRecord.count} onChange={(e) => handleRecordChange('count', e.target.value)}>
                {Array.from({ length: 7 }, (_, i) => i + 1).map(c => (
                  <option key={c} value={c}>{c}回目</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">メモ</label>
              <textarea
                className="form-control"
                rows={8}
                value={localRecord.memo}
                onChange={(e) => handleRecordChange('memo', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="danger" onClick={handleDelete} disabled={records.length === 0}>
          この日の記録を削除
        </Button>
        <div>
          <Button variant="secondary" className="me-2" onClick={onClose}>閉じる</Button>
          <Button variant="primary" onClick={handleSave}>保存</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InterviewModal;