import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Modal from "components/modal";

const SuccessModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState();
  useEffect(() => {
    router.isReady && (router.query.success || router.query.canceled) && setOpen(true);
  }, [router]);

  return (
    <Modal
      open={open}
      handleClose={() => {
        setOpen(false);
      }}
      title="Subscription Status"
    >
      {router.query.success ? "Successfully Subscribed" : "Subscription Failed"}
    </Modal>
  );
};

export default SuccessModal;
