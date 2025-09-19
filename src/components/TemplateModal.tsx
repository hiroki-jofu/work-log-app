import React, { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Form } from 'react-bootstrap';
import useTemplateStore from '../templateStore';

interface TemplateModalProps {
  show: boolean;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ show, onClose }) => {
  const { templates, loadTemplates, saveTemplate, deleteTemplate } = useTemplateStore();

  const [currentContents, setCurrentContents] = useState<string[]>(['', '', '']);
  const [activeTab, setActiveTab] = useState('0');

  useEffect(() => {
    if (show) {
      loadTemplates();
    }
  }, [show, loadTemplates]);

  useEffect(() => {
    setCurrentContents([...templates]);
  }, [templates]);

  const handleContentChange = (index: number, value: string) => {
    const newContents = [...currentContents];
    newContents[index] = value;
    setCurrentContents(newContents);
  };

  const handleSave = () => {
    const index = parseInt(activeTab, 10);
    saveTemplate(index, currentContents[index]);
    alert(`テンプレート ${index + 1} を保存しました。`);
  };

  const handleDelete = () => {
    const index = parseInt(activeTab, 10);
    if (window.confirm(`テンプレート ${index + 1} を削除しますか？`)) {
      deleteTemplate(index);
      alert(`テンプレート ${index + 1} を削除しました。`);
    }
  };

  const handleCopy = () => {
    const index = parseInt(activeTab, 10);
    const content = currentContents[index];
    if (navigator.clipboard && content) {
      navigator.clipboard.writeText(content).then(() => {
        alert(`テンプレート ${index + 1} の内容をコピーしました。`);
      }, (err) => {
        alert('コピーに失敗しました。');
        console.error('Could not copy text: ', err);
      });
    } else if (content) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`テンプレート ${index + 1} の内容をコピーしました。`);
      } catch (err) {
        alert('コピーに失敗しました。');
        console.error('Fallback: Oops, unable to copy', err);
      }
    } else {
      alert('コピーする内容がありません。');
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>テンプレート編集</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || '0')}
          id="template-tabs"
          className="mb-3"
          justify
        >
          {[0, 1, 2].map(index => (
            <Tab eventKey={index.toString()} title={`${index + 1}`} key={index}>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={currentContents[index]}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  placeholder="テンプレートとして保存したいテキストを入力..."
                />
              </Form.Group>
            </Tab>
          ))}
        </Tabs>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onClose}>閉じる</Button>
        <div>
          <Button variant="outline-danger" className="me-2" onClick={handleDelete}>
            削除
          </Button>
          <Button variant="outline-secondary" className="me-2" onClick={handleCopy}>
            コピー
          </Button>
          <Button variant="primary" onClick={handleSave}>
            保存
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TemplateModal;