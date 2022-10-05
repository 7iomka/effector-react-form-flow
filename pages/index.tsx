// import { baseLayout } from '@/app/page-factories';
import { Text, Tooltip } from "@mantine/core";

const CustomWrapper = () => {
  return (
    <Text mb={15} className="text-center">
      <div
        className="mx-auto px-4 md:px-8 max-w-screen-xl"
        style={{ maxWidth: "400px" }}
      >
        <div className="prose text-xl lg:text-2xl text-left">
          Floating UI is a low-level toolkit to create{" "}
          <Tooltip
            label="Floating element is one that floats on top of the UI without disrupting the flow of content, like this one!"
            color="blue"
            withArrow
            width={450}
            multiline
          >
            <span tabIndex={0} className="relative underline">
              floating elements
            </span>
          </Tooltip>
          . Tooltips, popovers, dropdowns, menus, and more.
        </div>
      </div>
    </Text>
  );
};

export default CustomWrapper;
