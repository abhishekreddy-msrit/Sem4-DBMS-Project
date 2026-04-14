import mysql.connector

from app.core.db import get_connection
from app.core.service_errors import ServiceError
from app.models.requests import TransferRequest


def process_transfer(payload: TransferRequest) -> None:
    try:
        with get_connection() as connection:
            cursor = connection.cursor(prepared=True)
            try:
                cursor.execute(
                    "CALL sp_Process_Transfer(%s, %s, %s)",
                    (payload.sender_vpa, payload.receiver_vpa, payload.amount),
                )

                # Consume all results from stored procedure
                for result in cursor.stored_results():
                    result.fetchall()

                connection.commit()
            finally:
                cursor.close()
    except mysql.connector.Error as err:
        message = err.msg if hasattr(err, "msg") else str(err)

        if "ERR_INSUFFICIENT_BALANCE" in message:
            raise ServiceError(400, "Insufficient balance") from err
        elif "ERR_INVALID_VPA" in message:
            raise ServiceError(400, "Invalid VPA") from err
        elif "ERR_SELF_TRANSFER" in message:
            raise ServiceError(400, "Cannot transfer to self") from err

        raise ServiceError(500, f"Database error: {message}") from err
