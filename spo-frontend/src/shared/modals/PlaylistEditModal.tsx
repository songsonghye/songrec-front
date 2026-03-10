import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { DEFAULT_THUMBNAIL } from '../../utils/image'
import styles from './PlaylistEditModal.module.css'
interface Props {
  isOpen: boolean
  onClose: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  uploadThumbnail: (file: File) => Promise<void>
  updateTitle: (title: string) => Promise<void>
  preview: string
  title: string
  onSave: () => Promise<void>
}

export default function PlaylistEditModal({
  isOpen,
  onClose,
  fileInputRef,
  uploadThumbnail,
  updateTitle,
  preview,
  title,
  onSave,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState(title)

  useEffect(() => {
    setPreviewUrl(preview)
  }, [preview])

  useEffect(() => {
    setNewTitle(title)
  }, [title, isOpen])

  useEffect(() => {
    if (!isOpen) {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
      setSelectedFile(null)
      setError(null)
      setPreviewUrl(preview)
    }
  }, [isOpen, preview, previewUrl])

  //닫을때 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null)
      setError(null)
      setPreviewUrl(preview)
    }
  }, [isOpen, preview])

  const handleClickThumbnail = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있어요.')
      e.target.value = ''
      return
    }

    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    const nextPreview = URL.createObjectURL(file)

    setSelectedFile(file)
    setPreviewUrl(nextPreview)

    e.target.value = ''
  }

  const handleSubmit = async () => {
    if (!newTitle.trim()) {
      setError('플레이리스트 이름은 필수 입력 항목입니다.')
      return
    }
    if (isUploading) return

    try {
      setUploading(true)
      setError(null)
      const titleChanged = newTitle.trim() !== title
      if (selectedFile) await uploadThumbnail(selectedFile)
      if (titleChanged) await updateTitle(newTitle.trim())
      if (!selectedFile && !titleChanged) {
        onClose()
        return
      }
      await onSave()
      onClose()
    } catch (err) {
      setError('업로드에 실패했어요. 잠시 후 다시 시도해주세요.')
      console.log(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={isUploading ? undefined : onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      ariaHideApp={false}
      contentLabel="Upload Thumbnail"
      shouldCloseOnOverlayClick={!isUploading}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>플레이리스트 수정</h3>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          disabled={isUploading}
        >
          ×
        </button>
      </div>
      <div className={styles.body}>
        <button
          type="button"
          onClick={handleClickThumbnail}
          className={styles.thumbnailButton}
        >
          <img
            src={previewUrl ?? DEFAULT_THUMBNAIL}
            alt=""
            className={styles.thumbnailPreview}
          />
          <span className={styles.thumbnailHint}>이미지 변경</span>
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />
        <div className={styles.formArea}>
          <label className={styles.label} htmlFor="playlist-title">
            제목
          </label>
          <input
            id="playlist-title"
            className={styles.titleInput}
            type="text"
            name="name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isUploading}
            >
              취소
            </button>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? '업로드 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}
