import React, { useState } from 'react';
import {
    createStyles, Text, Title, Stepper, Modal, Group, Button
} from '@mantine/core';

export function SetupWizard({opened, setOpened}) {
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    if (opened == false && active > 0) {
        setActive(0); // Reset the stepper whenever the wizard is closed
    }

    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Setup Wizard"
            size="auto"
        >
            <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                <Stepper.Step label="Roles" description="Setup role permissions">
                    Role Permissions
                </Stepper.Step>
                <Stepper.Step label="Verification" description="Setup user verification">
                    User Verification
                </Stepper.Step>
                <Stepper.Step label="Logging" description="Setup logging">
                    Logging
                </Stepper.Step>
                <Stepper.Step label="Filters" description="Setup chat filters">
                    Chat Filters
                </Stepper.Step>
                <Stepper.Completed>
                    All done!
                </Stepper.Completed>
            </Stepper>
            <Group position="right" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={active == 4 ? (() => setOpened(false)) : nextStep}>{active == 4 ? "Finish" : "Next step"}</Button>
            </Group>
        </Modal>
    )
}