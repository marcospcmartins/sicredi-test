import React, { useState, useEffect, ChangeEvent } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import InputMask from 'react-input-mask';
import { IApoliceForm } from '../../interfaces/IApoliceForm';

export interface IApoliceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IApoliceForm) => void;
  initialData?: IApoliceForm;
}

export const ApoliceForm = ({ open, onClose, onSave, initialData }: IApoliceFormProps) => {
  const [data, setData] = useState<IApoliceForm>({
    id: 0,
    apoliceNumber: 0,
    prizeValue: 0,
    insured: { name: '', email: '', cpfCnpj: '' },
    coverages: [],
  });

  useEffect(() => {
    if (initialData) {
      setData({
        id: initialData.id,
        apoliceNumber: initialData.apoliceNumber,
        prizeValue: initialData.prizeValue,
        insured: initialData.insured,
        coverages: initialData.coverages,
      });
    } else {
      setData({
        id: 0,
        apoliceNumber: 0,
        prizeValue: 0,
        insured: { name: '', email: '', cpfCnpj: '' },
        coverages: [],
      });
    }
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInsuredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      insured: {
        ...prevData.insured,
        [name]: value,
      },
    }));
  };

  const handleCoverageChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setData((prevData) => {
      const newCoverages = [...prevData.coverages];
      newCoverages[index] = { ...newCoverages[index], [name]: value };
      return { ...prevData, coverages: newCoverages };
    });
  };

  const handleAddCoverage = () => {
    setData((prevData) => ({
      ...prevData,
      coverages: [...prevData.coverages, { name: '', value: 0, id: 0 }],
    }));
  };

  const handleRemoveCoverage = (index: number) => {
    setData((prevData) => ({
      ...prevData,
      coverages: prevData.coverages.filter((_, i) => i !== index),
    }));
  };

  const validateCPF = (cpf: string) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!validateCPF(data.insured.cpfCnpj)) {
      alert('CPF inválido');
      return;
    }

    if (!validateEmail(data.insured.email)) {
      alert('Email inválido');
      return;
    }

    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{data.id ? 'Editar apólice' : 'Nova apólice'}</DialogTitle>
      <DialogContent>
        {data.id ? (
          <TextField
            margin="dense"
            name="id"
            label="id"
            type="string"
            fullWidth
            value={data.id || ''}
            onChange={handleChange}
            InputProps={{ readOnly: !!data.id }}
          />
        ) : (null)}

        <TextField
          margin="dense"
          name="apoliceNumber"
          label="Número da apólice"
          type="string"
          fullWidth
          value={data.apoliceNumber}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          name="prizeValue"
          label="Valor do prêmio"
          type="number"
          fullWidth
          value={data.prizeValue}
          onChange={handleChange}
        />

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Segurado</h3>
          <TextField
            margin="dense"
            name="name"
            label="Nome do segurado"
            type="text"
            fullWidth
            value={data.insured.name}
            onChange={handleInsuredChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email do segurado"
            type="email"
            fullWidth
            value={data.insured.email}
            onChange={handleInsuredChange}
          />

          <InputMask
            mask="999.999.999-99"
            value={data.insured.cpfCnpj}
            onChange={handleInsuredChange}
          >
            {() => (
              <TextField
                margin="dense"
                name="cpfCnpj"
                label="CPF/CNPJ do segurado"
                type="text"
                fullWidth
              />
            )}
          </InputMask>
          
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Coberturas</h3>
          <List>
            {data.coverages.map((coverage, index) => (
              <ListItem key={index} className="flex items-center space-x-2">
                <TextField
                  margin="dense"
                  name="name"
                  label="Nome da cobertura"
                  type="text"
                  value={coverage.name}
                  onChange={(event) => handleCoverageChange(index, event)}
                />
                <TextField
                  margin="dense"
                  name="value"
                  label="Valor da cobertura"
                  type="number"
                  value={coverage.value}
                  onChange={(event) => handleCoverageChange(index, event)}
                />
                <IconButton onClick={() => handleRemoveCoverage(index)} color="error">
                  <Remove />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            onClick={handleAddCoverage}
            variant="outlined"
            className="mt-2"
            startIcon={<Add />}
          >
            Adicionar cobertura
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};