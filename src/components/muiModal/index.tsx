import React from 'react'
import { Dialog, makeStyles, Theme, IconButton } from '@material-ui/core'
import { createStyles } from '@material-ui/styles'
import CloseIcon from '@material-ui/icons/Close'
import useModal from 'hooks/useModal'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useRef } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'

interface Props {
  children?: React.ReactNode
  closeIcon?: boolean
  width?: string
  maxWidth?: string
  isCardOnMobile?: boolean
  customIsOpen?: boolean
  customOnDismiss?: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& *': {
        boxSizing: 'border-box'
      },
      [theme.breakpoints.down('sm')]: {
        height: `calc(100% - ${theme.height.mobileHeader})`,
        marginTop: 'auto'
      }
    },
    mobileRoot: {
      '& .MuiDialog-scrollPaper': {
        [theme.breakpoints.down('sm')]: {
          alignItems: 'flex-end'
        }
      }
    },
    paper: {
      width: (props: Props) => props.width || 480,
      maxWidth: (props: Props) => props.maxWidth || 480,
      background: theme.palette.grey.A700,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxSizing: 'border-box',
      borderRadius: 20,
      overflowX: 'hidden',
      position: 'absolute',
      [theme.breakpoints.down('sm')]: {
        width: 'calc(100% - 32px)!important'
      }
    },
    mobilePaper: {
      [theme.breakpoints.down('sm')]: {
        border: 'none',
        borderTop: '1px solid ' + theme.palette.grey.A200,
        width: '100%!important',
        height: '100%',
        maxHeight: 'unset',
        margin: 0,
        paddingBottom: '30px',
        borderRadius: 0
      }
    },
    backdrop: {
      backgroundColor: 'rgba(0,0,0,.8)',
      [theme.breakpoints.down('sm')]: {
        height: `calc(100% - ${theme.height.mobileHeader})`,
        marginTop: theme.height.mobileHeader
      }
    },
    mobileBackdrop: {
      [theme.breakpoints.down('sm')]: {
        background: 'none'
      }
    },
    closeIconContainer: {
      padding: 0,
      position: 'absolute',
      top: 24,
      right: 24,
      '&:hover $closeIcon': {
        color: theme.palette.text.primary
      }
    },
    closeIcon: {
      color: theme.palette.grey[500]
    }
  })
)

export default function Modal(props: Props) {
  const { children, closeIcon, isCardOnMobile, customIsOpen, customOnDismiss } = props
  const classes = useStyles(props)
  const { matches } = useBreakpoint()
  const { isOpen, hideModal } = useModal()
  const node = useRef<any>()
  const hide = customOnDismiss ?? hideModal
  useOnClickOutside(node, matches ? undefined : hide)

  return (
    <>
      <Dialog
        open={customIsOpen !== undefined ? customIsOpen : isOpen}
        className={`${classes.root}${isCardOnMobile ? ' ' + classes.mobileRoot : ''}`}
        PaperProps={{ className: `${classes.paper}${isCardOnMobile ? ' ' + classes.mobilePaper : ''}`, ref: node }}
        BackdropProps={{ className: `${classes.backdrop}${isCardOnMobile ? ' ' + classes.mobileBackdrop : ''}` }}
      >
        {closeIcon && (
          <IconButton className={classes.closeIconContainer} onClick={hide}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        )}
        {children}
      </Dialog>
    </>
  )
}