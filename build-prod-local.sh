git -C $HOME/Tribyl/tribyl-ui checkout develop
git -C $HOME/Tribyl/tribyl-ui pull
npm install --prefix $HOME/Tribyl/tribyl-ui
npm run build --prefix $HOME/Tribyl/tribyl-ui