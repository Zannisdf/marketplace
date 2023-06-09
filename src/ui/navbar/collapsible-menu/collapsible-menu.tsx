import Link from "next/link";
import { classes } from "../classes";
import classNames from "classnames";
import { Icon } from "@marketplace/ui/icon";
import { links } from "../links";

export type CollapsibleMenuProps = {
  isOpen?: boolean;
  onPanelClick: (panelId: string) => void;
  onLinkClick: () => void;
  openPanel: string | null;
  currentPath?: string;
};

export const CollapsibleMenu = ({
  isOpen,
  currentPath,
  onPanelClick,
  onLinkClick,
  openPanel,
}: CollapsibleMenuProps) => (
  <ul
    className={classNames(classes.collapsibleMenu, {
      [`${classes.collapsibleMenu}--open`]: isOpen,
    })}
    aria-hidden={!isOpen}
  >
    {links.map(({ id, path, label, contents }) => (
      <li
        key={`collapsible-navbar-${path}`}
        className={classes.collapsibleMenuItem}
      >
        {id === "action" ? (
          <Link
            href={path}
            className={classNames(classes.collapsibleLink, {
              [`${classes.collapsibleLink}--current`]: currentPath === path,
            })}
            tabIndex={isOpen ? undefined : -1}
            onClick={onLinkClick}
          >
            {label}
          </Link>
        ) : null}
        {id === "submenu" ? (
          <>
            <button
              className={classes.collapsibleLink}
              onClick={() => onPanelClick(path)}
              tabIndex={isOpen ? undefined : -1}
            >
              {label}
              <span className={classes.collapsibleLinkIcon}>
                <Icon id="chevron-down" variant="solid" />
              </span>
            </button>
            <ul
              className={classNames(classes.innerMenu, {
                [`${classes.innerMenu}--open`]: openPanel === path,
              })}
              aria-hidden={openPanel !== path}
            >
              {contents.map(({ path: innerPath, label }) => (
                <li
                  key={`collapsible-navbar-panel-${innerPath}`}
                  className={classes.collapsibleMenuItem}
                >
                  <Link
                    href={innerPath}
                    className={classNames(classes.collapsibleLink, {
                      [`${classes.collapsibleLink}--current`]:
                        currentPath === innerPath,
                    })}
                    tabIndex={openPanel === path ? undefined : -1}
                    onClick={onLinkClick}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </li>
    ))}
  </ul>
);
