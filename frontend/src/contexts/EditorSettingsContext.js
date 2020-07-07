import React, { Component } from 'react';

export const EditorSettingsContext = React.createContext({
  darkTheme: true,
  fontSize: 16,
  orientation: "row"
});

export class EditorSettingsContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkTheme: true,
      fontSize: 16,
      orientation: "row"
    }
    this.updateEditorSettings = this.updateEditorSettings.bind(this);
  }

  updateEditorSettings(field, val) {
    this.setState({
      [field]: val
    });
  }

  render() {
    return (
      <EditorSettingsContext.Provider value={{
        settings: { ...this.state },
        updateEditorSettings: this.updateEditorSettings

      }}>
        {this.props.children}
      </EditorSettingsContext.Provider>
    )
  }
}
