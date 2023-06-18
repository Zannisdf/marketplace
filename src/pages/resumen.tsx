import { Icon } from "@marketplace/ui/icon";
import { getComponentClassNames } from "@marketplace/ui/namespace";
import classNames from "classnames";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";

type SummaryProps = {
  date: string;
  intervalInMinutes: number;
  practitionerName: string;
  practiceAddress: string;
  paidAmount: string;
  paymentMethod: string;
  totalAmount: string;
  status: string;
};

const classes = getComponentClassNames("ts-summary", {
  image: "image",
  alert: "alert",
  alertText: "alert-text",
  tableTitle: "table-title",
  table: "table",
  tableRow: "table-row",
  tableData: "table-data",
});

const Summary = ({
  date,
  intervalInMinutes,
  practitionerName,
  practiceAddress,
  paidAmount,
  paymentMethod,
  status,
}: SummaryProps) => {
  if (status === "ERROR") {
    return (
      <div
        className={classNames(
          classes.namespace,
          `${classes.namespace}--exception`
        )}
      >
        Algo salió mal 😥 por favor reintenta más tarde
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div
        className={classNames(
          classes.namespace,
          `${classes.namespace}--exception`
        )}
      >
        El pago fue rechazado, por favor reintenta la transacción
      </div>
    );
  }

  if (status === "CANCELED") {
    return (
      <div
        className={classNames(
          classes.namespace,
          `${classes.namespace}--exception`
        )}
      >
        El pago fue cancelado
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div
        className={classNames(
          classes.namespace,
          `${classes.namespace}--exception`
        )}
      >
        Su orden está pendiente de pago, reintente más tarde.
      </div>
    );
  }

  if (status === "PAID") {
    const currentDate = new Date(date);
    const formattedDate = new Intl.DateTimeFormat("es-CL", {
      dateStyle: "full",
    }).format(currentDate);
    const endDate = new Date(
      currentDate.getTime() + intervalInMinutes * 60 * 1000
    );
    const timeSlot = `${currentDate.getHours()}:${String(
      currentDate.getMinutes()
    ).padStart(2, "0")} - ${endDate.getHours()}:${String(
      endDate.getMinutes()
    ).padStart(2, "0")}`;
    return (
      <div className={classes.namespace}>
        <Image
          className={classes.image}
          src="/paid.png"
          alt="Mano haciendo gesto de aprobación"
          height={72}
          width={72}
        />

        <div className={classes.alert}>
          <Icon id="envelope" />
          <span className={classes.alertText}>
            Te enviamos una copia del sobrecupo a tu correo electrónico. Si no
            la ves, revisa tu carpeta de spam. Y recuerda presentar este email
            en recepción y pagar tu consulta médica donde corresponda 😃
          </span>
        </div>

        <div className={classes.tableTitle}>Tu sobrecupo</div>
        <div className={classes.table}>
          <div className={classes.tableRow}>
            <span className={classes.tableData}>Fecha:</span>
            <span className={classes.tableData}>
              {formattedDate[0].toUpperCase() + formattedDate.slice(1)}
            </span>
          </div>
          <div className={classes.tableRow}>
            <span className={classes.tableData}>Horario:</span>
            <span className={classes.tableData}>{timeSlot}</span>
          </div>
          <div className={classes.tableRow}>
            <span className={classes.tableData}>Especialista:</span>
            <span className={classes.tableData}>{practitionerName}</span>
          </div>
          <div className={classes.tableRow}>
            <span className={classes.tableData}>Dirección:</span>
            <span className={classes.tableData}>{practiceAddress}</span>
          </div>
          <div className={classes.tableRow}>
            <span className={classes.tableData}>Forma de pago:</span>
            <span className={classes.tableData}>{paymentMethod}</span>
          </div>
          <div className={classes.tableRow}>
            <span className={classes.tableData}>Pagado:</span>
            <span className={classes.tableData}>{paidAmount}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { itemId } = context.query;

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/status?itemId=${itemId}`
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return { status: "ERROR" };
    });

    return { props: data };
  } catch (error) {
    console.error(error);
    return { props: { status: "ERROR" } };
  }
};

export default Summary;