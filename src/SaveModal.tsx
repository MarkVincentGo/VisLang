import React, { FunctionComponent, useState } from 'react';
import { Button } from './Button';
import styles from './SaveModal.module.css';

interface InputProps {
  label?: string,
  placeholder?: string,
  value: string
  onChange: Function,
  name: string
}

const Input: FunctionComponent<InputProps> = ({ label, placeholder, value, onChange, name }) => {
  return (
    <div className={styles.inputComponent}>
      {label && <><label>{label}</label><br/></>}
      <input 
        placeholder={placeholder && ''}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}/>
      <br />
    </div>
  )
}

interface SaveModalProps {
  onClick?: any,
  saveFn(name: string): void
}
  
export const SaveModal: FunctionComponent<SaveModalProps> = ({ onClick, saveFn }) => {
  const [inputs, setInputs] = useState({
    nameInput: '',
    passwordInput: ''
  })

  const handleChange = (field: string, value: string): void => {
    setInputs({
      ...inputs,
      [field]: value
    })
  }

  const handleSave = (): void => {
    saveFn(inputs.nameInput)
  }

  return (
    <>
        <div className={styles.modalBackground} 
          onClick={onClick}>
            <div className={styles.saveModal} 
              onClick={(e: React.SyntheticEvent) => e.stopPropagation()}>
              <div className={styles.title}>Save</div>
              <div className={styles.form}>
                <Input label="Program Name" value={inputs.nameInput} onChange={handleChange} name="nameInput"/>
                <Input label="Password (optional)" value={inputs.passwordInput} onChange={handleChange} name="passwordInput"/>
                <Button className={styles.saveButton} name="save" backgroundColor="#C3CDE6" color="black" onClick={handleSave}/>
              </div>
            </div>
        </div>
      </>
  )
}

interface LoadModalProps {
  onClick?: any,
  loadFn(name: string): void
}

export const LoadModal: FunctionComponent<LoadModalProps> = ({ onClick, loadFn }) => {
  const [inputs, setInputs] = useState({
    nameInput: '',
    passwordInput: ''
  })

  const handleChange = (field: string, value: string): void => {
    setInputs({
      ...inputs,
      [field]: value
    })
  }

  const handleLoad = (): void => {
    loadFn(inputs.nameInput)
  }

  return (
    <>
        <div className={styles.modalBackground} 
          onClick={onClick}>
            <div className={styles.loadModal} 
              onClick={(e: React.SyntheticEvent) => e.stopPropagation()}>
              <div className={styles.title}>Load</div>
              <div className={styles.form}>
                <Input label="Program Name" value={inputs.nameInput} onChange={handleChange} name="nameInput"/>
                <Input label="Password" value={inputs.passwordInput} onChange={handleChange} name="passwordInput"/>
                <Button className={styles.loadButton} name="Load" backgroundColor="#C3CDE6" color="black" onClick={handleLoad}/>
              </div>
            </div>
        </div>
      </>
  )
}