import { useNavigate, useSearchParams } from "react-router-dom";
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useGetUserListQuery } from "../redux/api/userApi";
import dayjs from "dayjs";
import { Box, Button, Container, Typography } from "@mui/material";
import { URL } from "../utils/constants/URLConstants";
import { useAppSelector } from "../redux/hooks";
import Table from "../components/dynamicTable/DynamicTable";
import AutoCompleteField from "../components/dynamicTable/AutoCompleteField";

const Users = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data } = useGetUserListQuery({
    ...Object.fromEntries(searchParams.entries()),
  });

  const userRole = useAppSelector((state) => state.auth.userData?.role);

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First Name",
      renderCell: ({ value }: GridRenderCellParams) => {
        return value || "-";
      },
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      renderCell: ({ value }: GridRenderCellParams) => {
        return value || "-";
      },
      width: 150,
    },
    {
      field: "userName",
      headerName: "User Name",
      width: 150,
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      renderCell: ({ value }: GridRenderCellParams) =>
        dayjs(value).format("DD/MM/YYYY"),
      width: 150,
    },
    {
      field: "isActivated",
      headerName: "Status",
      renderCell: ({ value }: GridRenderCellParams) => {
        if (value) {
          return "Active";
        } else {
          return "Deactive";
        }
      },
    },
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: "Actions",
    //   width: 100,
    //   renderCell: (params) => (
    //     <>
    //       <GridActionsCellItem
    //         icon={<EditIcon />}
    //         label="Edit"
    //         className="textPrimary"
    //         onClick={() => handleEdit(params.row.employeeId)}
    //       />
    //       <GridActionsCellItem
    //         icon={<DeleteIcon />}
    //         label="Delete"
    //         onClick={() => handleDelete(params)}
    //       />
    //     </>
    //   ),
    // },
  ];

  const pageInfo: DynamicTable.TableProps = {
    columns: columns,
    rows: data?.data.users as GridValidRowModel[] | undefined,
    rowCount: data?.data.count,
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" color="initial">
            Users
          </Typography>
          {userRole === "Admin" ? (
            <Box>
              <Button variant="contained" onClick={() => navigate(URL.ADD)}>
                Add
              </Button>
            </Box>
          ) : null}
        </Box>
        <Table {...pageInfo}>
          <Box
            sx={{
              paddingBottom: 2,
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            {/* {userRole !== "User" && (
							<Box sx={{ width: "100%" }}>
								<AutoCompleteField
									options={employeeDD?.data || []}
									label='User'
									multiple
								/>
							</Box>
						)} */}
          </Box>
        </Table>
      </Container>
    </>
  );
};

export default Users;
