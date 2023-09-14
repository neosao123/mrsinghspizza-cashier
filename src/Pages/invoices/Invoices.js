import React, { useEffect, useState } from "react";
import Nav from "../../layout/Nav";
import { getInvoicesList } from "../../API/invoice";
import DataTable from "react-data-table-component";

function Invoices() {
  const columns = [
    {
      name: "Order ID",
      selector: (row) => {
        return <span>{row?.code}</span>;
      },
    },
    {
      name: "Order Number",
      selector: (row) => {
        return <span>{row?.orderCode}</span>;
      },
    },
    {
      name: "Phone Number",
      selector: (row) => {
        return <span>{row?.mobileNumber}</span>;
      },
    },
    {
      name: "Delivery Type",
      selector: (row) => {
        return <span>{row?.deliveryType.toUpperCase()}</span>;
      },
    },
    {
      name: "Order Date",
      selector: (row) => {
        return <span>{row?.created_at}</span>;
      },
    },
    {
      name: "Order Amount",
      selector: (row) => {
        return <span>{row?.grandTotal}</span>;
      },
    },
    {
      name: "Order Type",
      selector: (row) => {
        return <span>{row?.orderFrom.toUpperCase()}</span>;
      },
    },
    // {
    //   name: "Action",
    //   selector: (row) => {
    //     return (
    //       <>
    //         <div className="dropdown">
    //           <button
    //             type="button"
    //             className="btn btn-sm px-2 dropdown-toggle"
    //             data-bs-toggle="dropdown"
    //             style={{ backgroundColor: "#d5d5d5" }}
    //           >
    //             <i className="fa fa-cog" aria-hidden="true"></i>
    //           </button>
    //           <ul className="dropdown-menu text-center">
    //             <li>
    //               <Link className="dropdown-item" href="#">
    //                 Print
    //               </Link>
    //             </li>
    //             <li>
    //               <Link className="dropdown-item" href="#">
    //                 View
    //               </Link>
    //             </li>
    //           </ul>
    //         </div>
    //       </>
    //     );
    //   },
    // },
  ];

  const [invoicesList, setInvoicesList] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [deliveryType, setDeliveryType] = useState();
  const [orderType, setOrderType] = useState();
  const [orderId, setOrderId] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState();

  const fetchUsers = async (page) => {
    try {
      setLoading(true);

      const payload = {
        orderId: orderId ? orderId : "",
        cashierCode: "",
        deliveryType: deliveryType ? deliveryType : "",
        mobileNumber: "",
        fromDate: fromDate ? fromDate : "",
        toDate: toDate ? toDate : "",
        page: page,
      };

      await getInvoicesList(payload)
        .then((response) => {
          setData(response.data.data);
          setTotalRows(response.data.totalCount);
          setPerPage(response.data.perPage);
          setCurrentPage(response.data.currentPage);
          setLoading(false);
        })
        .catch((err) => {
          console.log("No Data Found", err);
        });
    } catch {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    try {
      const payload = {
        orderId: orderId ? orderId : "",
        cashierCode: "",
        deliveryType: deliveryType ? deliveryType : "",
        mobileNumber: "",
        fromDate: fromDate ? fromDate : "",
        toDate: toDate ? toDate : "",
        page: page,
      };

      await getInvoicesList(payload)
        .then((response) => {
          setData(response.data.data);
          setTotalRows(response.data.totalCount);
          setPerPage(response.data.perPage);
          setLoading(false);
        })
        .catch((err) => {
          console.log("No Data Found", err);
        });
    } catch {
      setLoading(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  // const handleSearch = (currentPage) => {
  // fetchUsers(currentPage);
  // };
  useEffect(() => {
    fetchUsers(1); // fetch page 1 of users
  }, []);

  return (
    <>
      <Nav />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12'>
            <form className='row border-bottom mb-3'>
              <div className='col-lg-2'>
                <label className='my-2'>From Date</label>

                <input
                  type='date'
                  className='mb-3 form-control'
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                ></input>
              </div>
              <div className='col-lg-2'>
                <label className='my-2'>To Date</label>
                <input
                  type='date'
                  className='mb-3 form-control'
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                ></input>
              </div>
              <div className='col-lg-2'>
                <label className='my-2'>Delivery Type</label>
                <select
                  className='mb-3 form-select'
                  defaultValue={""}
                  onChange={(e) => setDeliveryType(e.target.value)}
                >
                  <option value={""}>-- Choose Delivery Type --</option>
                  <option value={"pickup"}>Pickup</option>
                  <option value={"delivery"}>Delivery</option>
                </select>
              </div>
              <div className='col-lg-2 d-none'>
                <label className='my-2'>Order Type</label>
                <select
                  className='mb-3 form-select'
                  defaultValue={""}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option>-- Choose Order Type --</option>
                  <option value='store'>Store Order</option>
                  <option value='online'>Online Order</option>
                </select>
              </div>
              <div className='col-lg-2'>
                <label className='my-2'>Order Id</label>
                <input
                  type='text'
                  className='mb-3 form-control'
                  onChange={(e) => setOrderId(e.target.value)}
                ></input>
              </div>
              <div className='col-lg-2 my-2 d-flex justify-content-center align-items-end'>
                <button
                  type='button'
                  className='mb-2 btn btn-sm bg-secondary text-white px-3 fw-bold'
                  onClick={handleClick}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className='col-12'>
            <DataTable
              columns={columns}
              data={data}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Invoices;
