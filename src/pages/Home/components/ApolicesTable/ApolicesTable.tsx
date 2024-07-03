import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Button, IconButton, Box } from '@mui/material';
import { IGetApolicesResponse } from '../../../interfaces/IGetApolicesResponse';
import { IApolicesTableData } from '../../interfaces/IApolicesTableData';
import { getApoliceTableData } from '../../models/GetApoliceTableRows.model';
import { Edit, Delete, Add } from '@mui/icons-material'
import { IApoliceForm } from '../../interfaces/IApoliceForm';
import { ApoliceForm } from '../ApolicesForm/ApolicesForm';
import { getApoliceForm } from '../../models/GetApoliceForm.model';
import { getApoliceDataToSave } from '../../models/GetApoliceDataToSave.model';
import { IApoliceToSave } from '../../interfaces/IApoliceToSave';

export const ApoliceTable = () => {
  const [data, setData] = useState<IApolicesTableData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<IApoliceForm | undefined>(undefined);

  const fetchData = useCallback(async () => {
    const searchPage = page + 1;
      fetch(`/api/apolices?page=${searchPage}&size=${rowsPerPage}&search=${filter}`)
        .then((res) => res.json())
        .then((res: IGetApolicesResponse) => {
          const apolicesTableData = getApoliceTableData(res.content);
          setData(apolicesTableData);
          setTotalRows(res.totalItens);
        });
  }, [page, rowsPerPage, filter])

  useEffect(() => {
    fetchData();
  }, [data, fetchData]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (record: IApolicesTableData) => {
    setCurrentRecord(getApoliceForm(record));
    setOpenForm(true);
  };

  const handleDelete = (id: number) => {
    fetch(`/api/apolices/${id}`, { method: 'delete' })
      .finally(() => {
        fetchData();
      })
  };

  const handleAddNew = () => {
    setCurrentRecord(undefined);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setCurrentRecord(undefined);
    setOpenForm(false);
  };

  const fetchUpdateForm = (id: number, apolice: IApoliceToSave) => {
    fetch(`/api/apolices/${id}`, {method: 'PUT', body: JSON.stringify(apolice)})
  } 

  const fetchSaveForm = (apolice: IApoliceToSave) => {
    fetch('/api/apolices', { method: "POST", body: JSON.stringify(apolice)})
  }

  const handleSaveRecord = (apolice: IApoliceForm) => {
    if(apolice === undefined) return;
    
    const apoliceToSave = getApoliceDataToSave(apolice);
    if (apolice.id) {
      fetchUpdateForm(apolice.id, apoliceToSave)
    } else {
      fetchSaveForm(apoliceToSave)
    }
    fetchData();
  };

  const formatToBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className='p-4'>
      <div className="flex flex-col space-y-4 mb-4">
        <Box display="flex" gap={4}>
          <TextField label="Filtro" value={filter} onChange={(e) => setFilter(e.target.value)} className="flex-grow" variant="outlined" />
          <Button 
            onClick={handleAddNew}
            variant="outlined"
            size="small"
            id='addAction'
            className="bg-green-500 text-white hover:bg-green-700"
          >
            +
          </Button>
        </Box>
        <TableContainer className="border rounded-lg">
          <Table className="min-w-full">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell className="font-bold">Número da apólice</TableCell>
                <TableCell className="font-bold">Valor do prêmio</TableCell>
                <TableCell className="font-bold">Nome do segurado</TableCell>
                <TableCell className="font-bold">Email do segurado</TableCell>
                <TableCell className="font-bold">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="border-t">
                  <TableCell className="py-2 px-4">{row.apoliceNumber}</TableCell>
                  <TableCell className="py-2 px-4">{formatToBRL(row.prizeValue)}</TableCell>
                  <TableCell className="py-2 px-4">{row.nameOfInsured}</TableCell>
                  <TableCell className="py-2 px-4">{row.emailOfInsured}</TableCell>
                  <TableCell className="py-2 px-4">
                    <IconButton onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700">
                      <Delete />
                    </IconButton>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="mt-4"
        />
      </div>
      <ApoliceForm
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSaveRecord}
        initialData={currentRecord}
      />
    </div>

  );
};