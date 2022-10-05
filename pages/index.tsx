// import { baseLayout } from '@/app/page-factories';
import { Text, Tooltip } from "@mantine/core";

const CustomWrapper = () => {
  return (
    <Text mb={15} className="text-center">
      <div
        style={{
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* <div className="prose text-xl lg:text-2xl text-left">
          Floating UI is a low-level toolkit to create{" "}
          <Tooltip
            label="Floating element is one that floats on top of the UI without disrupting the flow of content, like this one!"
            color="blue"
            withArrow
            width={450}
            multiline
            inline
          >
            <span tabIndex={0} className="relative underline">
              floating elements
            </span>
          </Tooltip>
          . Tooltips, popovers, dropdowns, menus, and more.
        </div> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div> Floating UI is a low-level toolkit to dblabllalvav </div>
          <Tooltip
            label="Promo text will be here"
            color="blue"
            position="bottom"
            multiline
            withArrow
            transition="fade"
            inline
          >
            <span style={{ marginLeft: "25px" }} tabIndex={0}>
              (i)
            </span>
          </Tooltip>
        </div>
      </div>
    </Text>
  );
};

export default CustomWrapper;
