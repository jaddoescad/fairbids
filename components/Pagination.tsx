import React from "react";
import { Box, Button, HStack } from "@chakra-ui/react";


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const firstPage = 1;
    const lastPage = totalPages;

    if (currentPage <= 4) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...", lastPage);
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(firstPage, "...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(firstPage, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage);
    }
  }

  return (
    <HStack spacing={2}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      >
        Back
      </Button>
      {pageNumbers.map((pageNumber, index) => (
        <Button
          key={index}
          onClick={() => onPageChange(pageNumber)}
          isDisabled={pageNumber === currentPage || pageNumber === "..."}
        >
          {pageNumber}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;